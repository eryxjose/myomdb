using Application.Core;
using Application.Services.Favorites;
using Application.Services.Fvorites;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : BaseApiController
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetFavoriteMovies([FromQuery] PagingParams pagingParams)
    {
        var result = await _mediator.Send(new List.Query { PagingParams = pagingParams });
        return HandlePagedResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavoriteMovie(AddFavoriteDto favoriteMovie)
    {
        var result = await _mediator.Send(new Create.Command { FavoriteMovie = favoriteMovie });
        return HandleResult(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFavoriteMovie(Guid id)
    {
        var result = await _mediator.Send(new Delete.Command { Id = id });
        return HandleResult(result);
    }
}
