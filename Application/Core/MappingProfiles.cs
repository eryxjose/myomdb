using AutoMapper;
using Domain.Entities;
using Application.Services.Movies;
using Application.Services.Fvorites;

namespace Application.Mappings
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Mapeamento entre FavoriteMovie e AddFavoriteDto
            CreateMap<FavoriteMovie, AddFavoriteDto>().ReverseMap();

            // Mapeamento de FavoriteMovie para MovieSummary (e vice-versa, se necessário)
            CreateMap<FavoriteMovie, MovieSummary>();
            CreateMap<MovieSummary, FavoriteMovie>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar ID para evitar sobrescrita
                .ForMember(dest => dest.AddedAt, opt => opt.Ignore()); // Ignorar Data de Adição

            // Mapeamento de MovieDetail (OMDb) para MovieDetail (Application Layer)
            CreateMap<MovieDetail, MovieDetail>();
        }
    }
}
