import fetch from "node-fetch";
import asciifyImage from "asciify-image";

async function getPokemonImageUrl(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    );
    const data = await response.json();
    const imageUrl = data.sprites.front_default;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching Pokemon image URL:", error);
    throw error;
  }
}

async function displayPokemonAsAscii(pokemonName) {
  try {
    const imageUrl = await getPokemonImageUrl(pokemonName);
    if (!imageUrl) {
      console.log("Could not find image for this Pokémon.");
      return;
    }

    const options = {
      fit: "box",
      width: 50,
      height: 50,
    };

    asciifyImage(imageUrl, options, (err, asciified) => {
      if (err) {
        console.error("Error creating ASCII art:", err);
        return;
      }
      console.log(asciified);
    });
  } catch (error) {
    console.error("Error displaying Pokémon as ASCII:", error);
  }
}

const pokemonName = process.argv[2] || "pikachu";
displayPokemonAsAscii(pokemonName);
