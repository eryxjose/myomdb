using Application.Services.Movies;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MoviesController : BaseApiController
{
    private readonly IMediator _mediator;

    public MoviesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchMovies([FromQuery] MovieParams movieParams)
    {
        var query = new List.Query { MovieParams = movieParams };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
    
    [HttpGet("{imdbId}")]
    public async Task<IActionResult> GetMovieDetails(string imdbId)
    {
        var query = new Details.Query { ImdbID = imdbId };
        var result = await _mediator.Send(query);
        return HandleResult(result);
    }
}
