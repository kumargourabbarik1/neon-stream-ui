from django.core.management.base import BaseCommand

from api.models import Episode, Genre, Title, User


GENRES = ["Action", "Romance", "Fantasy", "Horror", "Comedy", "Drama", "Sci-Fi", "Slice of Life"]
RAW_TITLES = [
    ("Crimson Vanguard", "series", 2024, 9.1, 24, ["Action", "Fantasy"], True),
    ("Neon Petal Diaries", "series", 2023, 8.4, 12, ["Romance", "Drama"], False),
    ("Hollow Signal", "movie", 2025, 8.9, 1, ["Sci-Fi", "Horror"], True),
    ("Tidebreaker", "series", 2022, 8.7, 36, ["Action", "Drama"], False),
    ("Sugar & Static", "series", 2024, 7.9, 13, ["Comedy", "Slice of Life"], False),
    ("Ashen Crown", "series", 2021, 9.3, 48, ["Fantasy", "Action"], True),
    ("Paper Lanterns", "movie", 2020, 8.2, 1, ["Drama", "Romance"], False),
    ("Voidrunner Zero", "series", 2025, 8.6, 10, ["Sci-Fi", "Action"], True),
    ("The Quiet Kitchen", "series", 2023, 7.6, 24, ["Slice of Life", "Comedy"], False),
    ("Marrow House", "movie", 2024, 8.0, 1, ["Horror"], False),
    ("Starlight Requiem", "movie", 2022, 9.0, 1, ["Fantasy", "Drama"], True),
    ("Iron Blossom", "series", 2024, 8.5, 26, ["Action", "Romance"], False),
    ("Glass Monsoon", "series", 2021, 8.1, 22, ["Drama"], False),
    ("Hyperloop Honey", "series", 2025, 7.4, 8, ["Comedy", "Sci-Fi"], False),
    ("Grave of Foxes", "movie", 2019, 9.2, 1, ["Drama", "Fantasy"], False),
    ("Sablewind", "series", 2023, 8.8, 30, ["Action", "Fantasy"], True),
    ("Midnight Ramen Club", "series", 2022, 7.8, 16, ["Slice of Life"], False),
    ("Echo Protocol", "movie", 2025, 8.3, 1, ["Sci-Fi"], False),
    ("Crimson Vanguard: Origins", "movie", 2021, 8.6, 1, ["Action"], False),
    ("Whisper of the Hollow", "series", 2020, 7.7, 12, ["Horror", "Drama"], False),
    ("Petalfall", "series", 2024, 8.9, 20, ["Romance", "Fantasy"], True),
    ("Titan Circuit", "series", 2023, 8.2, 25, ["Action", "Sci-Fi"], False),
    ("Cloudbound", "movie", 2023, 8.7, 1, ["Fantasy", "Slice of Life"], False),
    ("Bitter Orange", "series", 2022, 7.5, 11, ["Romance", "Comedy"], False),
    ("Nightgale", "series", 2025, 9.0, 6, ["Horror", "Fantasy"], True),
    ("Zero Gravity Cafe", "series", 2021, 8.0, 24, ["Comedy", "Sci-Fi"], False),
    ("The Last Cartographer", "movie", 2024, 8.8, 1, ["Drama", "Fantasy"], False),
    ("Stormcaller Saga", "series", 2019, 9.4, 52, ["Action", "Fantasy"], False),
    ("Silver Tide", "movie", 2022, 7.9, 1, ["Drama"], False),
    ("Pixel Hearts", "series", 2025, 8.1, 9, ["Romance", "Slice of Life"], False),
]
EPISODE_NAMES = ["The Promise", "Ash and Salt", "Small Mercies", "A Door in the Rain", "Nightcall", "What the River Kept"]


class Command(BaseCommand):
    help = "Seeds sample catalogue data and local demo accounts. Safe to run repeatedly."

    def handle(self, *args, **options):
        genres = {}
        for index, name in enumerate(GENRES):
            genre, _ = Genre.objects.get_or_create(
                name=name,
                defaults={"image_url": f"https://picsum.photos/seed/movizo-g-{index}/640/400"},
            )
            genres[name] = genre

        for index, (name, kind, year, rating, episode_count, genre_names, trending) in enumerate(RAW_TITLES):
            title, _ = Title.objects.get_or_create(
                name=name,
                defaults={
                    "kind": kind,
                    "year": year,
                    "rating": rating,
                    "season_count": (index % 3) + 1 if kind == "series" else 1,
                    "status": "completed" if kind == "movie" or index % 3 == 0 else "ongoing",
                    "studio": ["Studio Kaida", "Lumen Works", "Orbit Animation", "House Sora"][index % 4],
                    "synopsis": f"{name} follows an unlikely crew bound by a promise made in a dying city.",
                    "poster_url": f"https://picsum.photos/seed/movizo-p-{index}/400/600",
                    "banner_url": f"https://picsum.photos/seed/movizo-b-{index}/1600/900",
                    "trending": trending,
                    "view_count": 2_000_000 + index * 700_000,
                },
            )
            title.genres.set([genres[genre_name] for genre_name in genre_names])
            if kind == "series":
                for number in range(1, min(episode_count, 6) + 1):
                    Episode.objects.get_or_create(
                        title=title,
                        season_number=1,
                        number=number,
                        defaults={
                            "name": EPISODE_NAMES[number - 1],
                            "duration_seconds": 22 * 60 + (number % 4) * 60,
                            "synopsis": "A turning point arrives sooner than anyone expected.",
                            "thumbnail_url": f"https://picsum.photos/seed/{title.slug}-ep-{number}/320/180",
                        },
                    )

        for email, display_name, role in [
            ("rin@movizo.tv", "Rin Kobayashi", User.Role.SUPERADMIN),
            ("daniel@movizo.tv", "Daniel Cruz", User.Role.ADMIN),
            ("viewer@movizo.tv", "Movizo Viewer", User.Role.VIEWER),
        ]:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": email, "display_name": display_name, "role": role},
            )
            if created:
                user.set_password("MovizoDemo123!")
                user.save()

        self.stdout.write(self.style.SUCCESS("Movizo sample data is ready."))
