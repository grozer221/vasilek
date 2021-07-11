using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace vasilek.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [Authorize]
        public string Index()
        {
            if (User.Identity.IsAuthenticated)
                return User.Identity.Name;
            else
                return "unautorised";
        }
    }
}
