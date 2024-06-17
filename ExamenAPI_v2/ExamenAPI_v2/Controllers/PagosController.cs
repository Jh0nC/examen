namespace examenAPI_v2.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PagosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pagos>>>

        GetPagos()

        {
            return await _context.Pagos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pagos>> GetPago(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);
            if (pago == null)
            {
                return NotFound();
            }
            return pago;
        }

        [HttpPost]
        public async Task<ActionResult<Pagos>>

        PostCSharpCornerArticle(Pagos pago)

        {
            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPago", new
            {
                id = pago.id
            }, pago);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPago(int id, Pagos pago)
        {
            if (id != pago.id)
            {
                return BadRequest();
            }
            _context.Entry(pago).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!PagoExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePago(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);
            if (pago == null)
            {
                return NotFound();
            }
            _context.Pagos.Remove(pago);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool PagoExist(int id)
        {
            return _context.Pagos.Any(e => e.id == id);
        }
    }
}
