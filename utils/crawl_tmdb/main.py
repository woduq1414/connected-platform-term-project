import json
import time

def do_something():
    db = next(get_db())
    genres = [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }
    ]

    for page in range(5, 10):
        print(page)
        url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page={page}&sort_by=popularity.desc"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}"}

        response = requests.get(url, headers=headers)

        data = json.loads(response.text)["results"]

        for item in data:
            movie_id = item["id"]
            new_video = Video(
                title=item["title"],
                url=None,
                summary=item["overview"],
                genre=", ".join([
                    genre["name"] for genre in genres if genre["id"] in item["genre_ids"]
                ]),
                thumbnailUrl=item["backdrop_path"],
                # youtubeUrl="
            )

            url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=ko-KR&append_to_response=videos"

            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}"}

            response = requests.get(url, headers=headers)

            detail_data = json.loads(response.text)

            new_video.duration = detail_data["runtime"] * 60
    
            if detail_data["videos"]["results"]:
                new_video.youtubeUrl = detail_data["videos"]["results"][0]["key"]
            else:
                new_video.youtubeUrl = None

            db.add(new_video)
            print(new_video.title)
            # time.sleep(0.5)

        # print(new_video.__dict__)
        db.commit()

        time.sleep(3)
    
        # print(data)
        # print(response.text)


if __name__ == '__main__':
    if __package__ is None:
        import sys
        from os import path
        print(path.dirname(path.dirname(path.abspath(__file__))))
        sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
        import requests
        from db import get_db, Video, TMDB_ACCESS_TOKEN

        do_something()
