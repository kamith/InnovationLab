using Microsoft.AspNetCore.Mvc;
using WebApp.Controllers.Lib;
using System.Text;
using WebApp.Models;
using Newtonsoft.Json;

namespace WebApp.Controllers;

[ApiController]
[Route("images")]
public class ImageController : ControllerBase
{

    private readonly ILogger<ImageController> _logger;
    private BlobAccess _blobAccess;

    public ImageController(ILogger<ImageController> logger)
    {
        _logger = logger;
        _blobAccess = new BlobAccess();
    }

    /// <summary>
    /// Retrieves string value of stream.
    /// </summary>
    /// <param name="stream"></param>
    /// <returns>String value of input stream.</returns>
    public static async Task<string> GetStringFromStream(Stream stream)
    {
        StringBuilder sb = new StringBuilder();
        byte[] buffer = new byte[2048];
        int bytesRead;
        while((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
        {
            int rest;
            while(bytesRead != buffer.Length && (rest = await stream.ReadAsync(buffer, bytesRead, buffer.Length - bytesRead)) > 0)
            {
                bytesRead += rest;
            }
            string line = Encoding.ASCII.GetString(buffer, 0, bytesRead);
            sb.Append(line);
        }

        return sb.ToString();
    }

    /// <summary>
    /// Retrieves prediction from AI Api on image input.
    /// </summary>
    /// <param name="imageStr">Base64 encoded image.</param>
    /// <returns>int prediction in milliliters.</returns>
    private async Task<int> GetResultFromAiApi(string imageStr) 
    {
        using(HttpClient client = new HttpClient())
        {
            string address = "http://innovationapi.h8bpd4dkgkakb5gy.eastus.azurecontainer.io/combined";
            // Format imageStr to fit requested json format of api
            string requestBody = $"{"{"}\"data\":\"{imageStr}\"{"}"}";
            HttpResponseMessage response = await client.PostAsync(address, new StringContent(requestBody, Encoding.UTF8, "application/json"));
            string result = await response.Content.ReadAsStringAsync();
            // result formatted as {"<type>":[double]}
            if(result.Equals("{}")) return 0;
            result = result.Split(':')[1].Split('}')[0].Split(',')[0];
            int ans = (int)Math.Round(double.Parse(result), MidpointRounding.AwayFromZero);
            return ans;
        }
    }

    // Generate random name captured by
    private string GenerateCapturedBy()
    {
        string[] arr = [
                        "Gurleen", "Eyas", "Ethan", "Cal", 
                        "Josh", "Adam", "Grant", "Nick", 
                        "Parker", "Owen", "Kamith", "Peter"
                        ];
        int randIndex = new Random().Next(0, arr.Length - 1);
        return arr[randIndex];
    }

    /// <summary>
    /// Creates a json string of ImageResult with inputs.
    /// </summary>
    /// <param name="imageStr">Base64 encoded image.</param>
    /// <param name="resultMl">int predicted milliliters of imageStr.</param>
    /// <returns>Json string of ImageResult with given parameters.</returns>
    private string CreateImageResultJson(string imageStr, int resultMl)
    {
        return JsonConvert.SerializeObject(new ImageResult() { CapturedBy=GenerateCapturedBy(), ImageData=imageStr, LiquidAmount=resultMl, DateUploaded=DateTime.Now.ToShortDateString() });
    }

    /// <summary>
    /// /upload-image endpoint<br /><br />
    /// -Base64 encoded image should be in request body<br /><br />
    /// Runs prediction on image and uploads image and prediction to blob storage
    /// </summary>
    /// <returns>int of predicted milliliters of image.</returns>
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage()
    {
        try {
            Stream httpBody = HttpContext.Request.Body;
            string imageStr = await GetStringFromStream(httpBody);
            int resultMl = await GetResultFromAiApi(imageStr);
            string json = CreateImageResultJson(imageStr, resultMl);
            int resultNumber = await _blobAccess.UploadFromStringAsync(json);
            return Ok(resultNumber);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }

    /// <summary>
    /// /result/{id} endpoint<br /><br />
    /// Gets ImageResult json from blob storage.
    /// </summary>
    /// <param name="id">Must be id of a file in blob storage.</param>
    /// <returns>ImageResult json string.</returns>
    [HttpGet("result/{id}")]
    public async Task<IActionResult> GetImageResult(int id)
    {
        try {
            string result = await _blobAccess.GetBlobFromId(id);
            return Ok(result);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }

    /// <summary>
    /// /total-results endpoint<br /><br />
    /// Gets the total amount of results in blob storage.
    /// </summary>
    /// <returns>int representing total results in blob storage.</returns>
    [HttpGet("total-results")]
    public async Task<IActionResult> GetTotalResults()
    {
        try {
            int response = await _blobAccess.GetLastFileIndex();
            return Ok(response);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }
}
