using System.Text;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using WebApp.Models;

namespace WebApp.Controllers.Lib;

public class JsonInfo
{
    public static string GetJsonVariable(string key)
    {
        string ans = "";
        bool found = false;
        using(JsonTextReader reader = new JsonTextReader(new StreamReader("devinfo.json")))
        {
            while(!found && reader.Read())
            {
                if(reader.TokenType.ToString().Equals("PropertyName"))
                {
                    string checkKey = reader.Value != null ? reader.Value.ToString() ?? "" : "";
                    if(!checkKey.Equals(key)) continue;
                    reader.Read();
                    ans = reader.Value != null ? reader.Value.ToString() ?? "" : "";
                    found = true;
                    break;
                }
            }
        }
        return ans;
    }

}

public class BlobAccess
{

    private BlobContainerClient _containerClient;

    public BlobAccess()
    {
        string connectionString = Environment.GetEnvironmentVariable("BlobConnectionString") ?? JsonInfo.GetJsonVariable("BlobConnectionString");
        string containerName = "jsoncontainer";
        _containerClient = new BlobContainerClient(connectionString, containerName);
    }

    public static string GetBlobFileName(int index)
    {
        return $"{index}_result.json";
    }

    private int GetNumPrefix(string x)
    {
        char[] arr = x.ToCharArray();
        string n = "0";
        for(int i = 0; i < arr.Length; i++)
        {
            if(!(arr[i] >= '0' && arr[i] <= '9')) break;
            n += arr[i];
        }
        if(n.Length == 1) return 0;
        n = n.Substring(1);
        return int.Parse(n);
    }

    public async Task<int> GetLastFileIndex()
    {
        IAsyncEnumerable<Page<BlobItem>> result = _containerClient.GetBlobsAsync().AsPages(default, null);
        int largest = 0;
        await foreach(Page<BlobItem> blobPage in result)
        {
            foreach(BlobItem blobItem in blobPage.Values)
            {
                int prefix = GetNumPrefix(blobItem.Name);
                if(largest < prefix) largest = prefix;
            }
        }
        return largest;
    }

    public async Task<int> UploadFromStringAsync(string contents)
    {
        int resultIndex = (await GetLastFileIndex()) + 1;
        BlobClient blobClient = _containerClient.GetBlobClient(GetBlobFileName(resultIndex));
        await blobClient.UploadAsync(BinaryData.FromString(contents), overwrite: true);
        return resultIndex;
    }

    public async Task<string> GetBlobFromId(int id)
    {
        BlobClient blobClient = _containerClient.GetBlobClient(GetBlobFileName(id));
        BlobDownloadResult downloadResult = await blobClient.DownloadContentAsync();
        return downloadResult.Content.ToString();
    }
}