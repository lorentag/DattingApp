using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _maper;

        public UsersController(IUserRepository userRepository, IMapper maper)
        {
            _maper = maper;
            _userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersDtoAsync();          
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberDtoAsync(username); 
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto member) {

            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user     = await _userRepository.GetUserByUsernameAsync(username);

            _maper.Map(member, user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Fail to update user");

        }
    }
}