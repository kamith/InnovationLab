using Newtonsoft.Json;

namespace WebApp.Controllers.Lib;

public class JsonInfo
{
    /// <summary>
    /// Get json value from local devinfo.json file.<br /><br />
    /// -file is hidden from repo, accessible in #resources channel
    /// </summary>
    /// <param name="key">Key of json variable.</param>
    /// <returns>Json value associated to given key.</returns>
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