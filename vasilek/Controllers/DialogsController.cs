using vasilek.Models;
using vasilek.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace vasilek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DialogsController : ControllerBase
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        private DialogsRepository _dialogsRep;
        public DialogsController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
            _dialogsRep = new DialogsRepository(_ctx);
        }

        //[HttpGet]
        //public string Get()
        //{
        //    return JsonConvert.SerializeObject(new ResponseModel() 
        //    {
        //        ResultCode = 0, 
        //        Data = _dialogsRep.GetDialogsByUserLogin(_userRep.GetUserIdByLogin(HttpContext.User.Identity.Name)) 
        //    });
        //}


        //[HttpGet] Create Fake Data
        //public string Get()
        //{
        //    var users = new List<UserModel>();
        //    users.Add(_userRep.GetUserById(2));
        //    users.Add(_userRep.GetUserByLogin(HttpContext.User.Identity.Name));
        //    var messages = new List<MessageModel>();
        //    messages.Add(new MessageModel { MessageText = "здарова"});
        //    messages.Add(new MessageModel { MessageText = "бувай" });
        //    var dialog = new DialogModel()
        //    {
        //        Users = users,
        //        AuthorId = _userRep.GetUserIdByLogin(HttpContext.User.Identity.Name),
        //        Messages = messages
        //    };

        //    _ctx.Dialogs.Add(dialog);
        //    _ctx.SaveChanges();

        //    return JsonConvert.SerializeObject(new ResponseModel() 
        //    {
        //        ResultCode = 0, 
        //        Data = "good" 
        //    });
        //}

        [HttpGet]
        public string Get()
        {
            var messages = _ctx.Messages.Include(m => m.Dialog).ThenInclude(d => d.Users).FirstOrDefault(m => m.Id == 1);
            var dialog = messages.Dialog;
            dialog.Messages = null;
            foreach (var user in dialog.Users)
                user.Dialogs = null;
            return JsonConvert.SerializeObject(new ResponseModel()
            {
                ResultCode = 0,
                Data = dialog
            });
        }


    }
}
