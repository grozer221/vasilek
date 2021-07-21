using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using vasilek.Interfaces;
using vasilek.Models;
using vasilek.Repository;

namespace vasilek.Hubs
{
    [Authorize]
    public class DialogsHub : Hub<IDialogsClient>
    {
        private AppDatabaseContext _ctx;
        private DialogsRepository _dialogsRep;
        private UserRepository _userRep;
        public DialogsHub(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _dialogsRep = new DialogsRepository(_ctx);
            _userRep = new UserRepository(ctx);
        }
        public async Task SendMessage(string messageText)
        {
            //await Clients.Others.ReceiveNotification();
        }
        
        public override async Task OnConnectedAsync()
        {
            var dialogs = _dialogsRep.GetDialogsByUserLogin(Context.User.Identity.Name);
            await Clients.Caller.ReceiveDialogs(dialogs);
        }

        //public override async Task OnDisconnectedAsync(Exception exception)
        //{

        //}
    }
//    using vasilek.Models;
//using vasilek.Repository;
//using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
//using Microsoft.EntityFrameworkCore;
//using System.Linq;
//using Microsoft.AspNetCore.Authorization;
//using System.Collections.Generic;

//namespace vasilek.Controllers
//    {
//        [Route("api/[controller]")]
//        [ApiController]
//        [Authorize]
//        public class DialogsController : ControllerBase
//        {
//            private AppDatabaseContext _ctx;
//            private UserRepository _userRep;
//            private DialogsRepository _dialogsRep;
//            public DialogsController(AppDatabaseContext ctx)
//            {
//                _ctx = ctx;
//                _userRep = new UserRepository(_ctx);
//                _dialogsRep = new DialogsRepository(_ctx);
//            }

//            //[HttpGet]
//            //public string Get()
//            //{
//            //    return JsonConvert.SerializeObject(new ResponseModel() 
//            //    {
//            //        ResultCode = 0, 
//            //        Data = _dialogsRep.GetDialogsByUserLogin(_userRep.GetUserIdByLogin(HttpContext.User.Identity.Name)) 
//            //    });
//            //}


//            //[HttpGet] Create Fake Data
//            //public string Get()
//            //{
//            //    var users = new List<UserModel>();
//            //    users.Add(_userRep.GetUserById(2));
//            //    users.Add(_userRep.GetUserByLogin(HttpContext.User.Identity.Name));
//            //    var messages = new List<MessageModel>();
//            //    messages.Add(new MessageModel { MessageText = "здарова"});
//            //    messages.Add(new MessageModel { MessageText = "бувай" });
//            //    var dialog = new DialogModel()
//            //    {
//            //        Users = users,
//            //        AuthorId = _userRep.GetUserIdByLogin(HttpContext.User.Identity.Name),
//            //        Messages = messages
//            //    };

//            //    _ctx.Dialogs.Add(dialog);
//            //    _ctx.SaveChanges();

//            //    return JsonConvert.SerializeObject(new ResponseModel() 
//            //    {
//            //        ResultCode = 0, 
//            //        Data = "good" 
//            //    });
//            //}

//            [HttpGet]
//            public string Get()
//            {
//                return JsonConvert.SerializeObject(new ResponseModel()
//                {
//                    ResultCode = 0,
//                    Data = _dialogsRep.GetDialogsByUserLogin(HttpContext.User.Identity.Name)
//                });
//            }


//        }
//    }

}
