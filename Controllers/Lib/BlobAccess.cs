using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace WebApp.Controllers.Lib;

public class BlobAccess
{
    private BlobContainerClient _containerClient;

    public BlobAccess()
    {
        string connectionString = Environment.GetEnvironmentVariable("BlobConnectionString") ?? JsonInfo.GetJsonVariable("BlobConnectionString");
        string containerName = "jsoncontainer";
        _containerClient = new BlobContainerClient(connectionString, containerName);
    }

    /// <summary>
    /// Create .json blob file name with its given index.<br /><br />
    /// -index must not already be in blob storage.
    /// </summary>
    /// <param name="index"></param>
    /// <returns>Formatted json file name with index at start.</returns>
    public static string GetBlobFileName(int index)
    {
        return $"{index}_result.json";
    }

    /// <summary>
    /// Get the number prefix of a file name. <br /><br />
    /// File name formatted as: <br />
    /// &lt; int >_&lt; filename >.&lt; filetype > <br /><br />
    /// -Prefix is used as index for files.
    /// </summary>
    /// <param name="x"></param>
    /// <returns>int prefix of file.</returns>
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

    /// <summary>
    /// Gets the last file index in the blob storage. <br /><br />
    /// -Used to determine how many blobs are in the blob storage.
    /// </summary>
    /// <returns>An int representing the last file index in the blob storage.</returns>
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

    /// <summary>
    /// Upload a string to the blob. <br /><br />
    /// -String must be in the JSON format of the ImageResult class.
    /// </summary>
    /// <param name="contents">A JSON string of the ImageResult class</param>
    /// <returns>The index that the blob result is retrievable by.</returns>
    public async Task<int> UploadFromStringAsync(string contents)
    {
        int resultIndex = (await GetLastFileIndex()) + 1;
        BlobClient blobClient = _containerClient.GetBlobClient(GetBlobFileName(resultIndex));
        await blobClient.UploadAsync(BinaryData.FromString(contents), overwrite: true);
        return resultIndex;
    }

    /// <summary>
    /// Retrieve the contents of a blob in a json string with a blob id
    /// </summary>
    /// <param name="id">The id of the blob.</param>
    /// <returns>A json string of the contents of the given blob.</returns>
    public async Task<string> GetBlobFromId(int id)
    {
        BlobClient blobClient = _containerClient.GetBlobClient(GetBlobFileName(id));
        BlobDownloadResult downloadResult = await blobClient.DownloadContentAsync();
        return downloadResult.Content.ToString();
    }
}