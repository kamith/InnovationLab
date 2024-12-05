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

    public ImageController(ILogger<ImageController> logger)
    {
        _logger = logger;
    }

    // Upload json to azure blob storage
    private async Task<int> UploadToBlob(string json)
    {
        BlobAccess blob = new BlobAccess();
        return await blob.UploadFromStringAsync(json);
    }

    // Retrieve file from azure blob storage with unique id
    private async Task<string> RetrieveFromBlob(int id)
    {
        BlobAccess blob = new BlobAccess();
        return await blob.GetBlobFromId(id);
    }

    private async Task<int> GetLargestIndexFromBlob()
    {
        BlobAccess blob = new BlobAccess();
        return await blob.GetLastFileIndex();
    }

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

    private async Task<int> GetResultFromAiApi(string imageStr) 
    {
        using(HttpClient client = new HttpClient())
        {
            string address = "http://innovationapi.h8bpd4dkgkakb5gy.eastus.azurecontainer.io/combined";
            string requestBody = $"{"{"}\"data\":\"{imageStr}\"{"}"}";
            HttpResponseMessage response = await client.PostAsync(address, new StringContent(requestBody, Encoding.UTF8, "application/json"));
            string result = await response.Content.ReadAsStringAsync();
            // result formatted as {"<type>":[double]}
            result = result.Split(':')[1].Split('}')[0];
            int ans = (int)Math.Round(double.Parse(result), MidpointRounding.AwayFromZero);
            return ans;
        }
    }

    private string CreateImageResultJson(string imageStr, int resultMl)
    {
        return JsonConvert.SerializeObject(new ImageResult() { ImageData=imageStr, LiquidAmount=resultMl, DateUploaded=DateTime.Now.ToShortDateString() });
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage()
    {
        try {
            Stream httpBody = HttpContext.Request.Body;
            string imageStr = await GetStringFromStream(httpBody);
            int resultMl = await GetResultFromAiApi(imageStr);
            string json = CreateImageResultJson(imageStr, resultMl);
            int resultNumber = await UploadToBlob(json);
            return Ok(resultNumber);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }

    [HttpGet("result/{id}")]
    // Get desired image result by id
    public async Task<IActionResult> GetImageResult(int id)
    {
        try {
            string result = await RetrieveFromBlob(id);
            return Ok(result);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }

    [HttpGet("total-results")]
    public async Task<IActionResult> GetTotalResults()
    {
        try {
            int response = await GetLargestIndexFromBlob();
            return Ok(response);
        } catch(Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest();
        }
    }
}
