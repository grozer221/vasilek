namespace vasilek.Models
{
    public class FileModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public virtual MessageModel Message { get; set; }
    }
}
