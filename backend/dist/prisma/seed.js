"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sampleData = [
    {
        title: "The Shawshank Redemption",
        type: "MOVIE",
        director: "Frank Darabont",
        budget: 25000000,
        location: "New York, USA",
        duration: 142,
        year: 1994,
        genre: "DRAMA",
        rating: 9.3,
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    },
    {
        title: "The Godfather",
        type: "MOVIE",
        director: "Francis Ford Coppola",
        budget: 6000000,
        location: "Rome, Italy",
        duration: 175,
        year: 1972,
        genre: "CRIME",
        rating: 9.2,
        description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
        title: "Breaking Bad",
        type: "TV_SHOW",
        director: "Vince Gilligan",
        budget: 3000000,
        location: "Sydney, Australia",
        duration: 47,
        year: 2008,
        genre: "CRIME",
        rating: 9.5,
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5MWZiNWM1ZWQyXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    },
    {
        title: "Pulp Fiction",
        type: "MOVIE",
        director: "Quentin Tarantino",
        budget: 8000000,
        location: "Vancouver, Canada",
        duration: 154,
        year: 1994,
        genre: "CRIME",
        rating: 8.9,
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
        title: "Stranger Things",
        type: "TV_SHOW",
        director: "The Duffer Brothers",
        budget: 6000000,
        location: "Mumbai, India",
        duration: 51,
        year: 2016,
        genre: "SCIENCE_FICTION",
        rating: 8.7,
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
    {
        title: "Inception",
        type: "MOVIE",
        director: "Christopher Nolan",
        budget: 160000000,
        location: "Tokyo, Japan",
        duration: 148,
        year: 2010,
        genre: "SCIENCE_FICTION",
        rating: 8.8,
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        language: "English",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    },
];
async function main() {
    console.log("Starting database seeding...");
    for (const media of sampleData) {
        const result = await prisma.media.create({
            data: media,
        });
        console.log(`Created media: ${result.title} (${result.type})`);
    }
    console.log("Database seeding completed!");
}
main()
    .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map