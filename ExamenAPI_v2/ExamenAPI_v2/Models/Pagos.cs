namespace ExamenAPI_v2.Models
{
    public class Pagos
    {
        [Key]
        public int id { get; set; }
        public string? vehiclePlate { get; set; }
        public string? tollName { get; set; }
        public string? idCategory { get; set; }
        public string? registrationDate { get; set; }
        public decimal value { get; set; }
    }
}
