namespace WebApp.Models;

public class ImageResult
{
    public required string ImageData { get; set; }
    public int LiquidAmount { get; set; }
    public required string DateUploaded { get; set; }
    public required string CapturedBy { get; set; }
    public int ResultId { get; set; }
}
