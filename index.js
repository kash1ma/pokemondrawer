import fetch from "node-fetch";
import asciifyImage from "asciify-image";
import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getPokemonImageUrl(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`,
    );
    const data = await response.json();
    return data.sprites.front_default;
  } catch (error) {
    console.error("Error fetching Pokémon image URL:", error);
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
      width: Math.min(process.stdout.columns, 50),
      height: Math.min(Math.floor(process.stdout.rows / 2), 25),
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

async function getUserInput() {
  return new Promise((resolve) => {
    rl.question("Enter the name of the Pokémon to display: ", (answer) => {
      resolve(answer.trim() || "pikachu");
      rl.close();
    });
  });
}

(async () => {
  const pokemonName = await getUserInput();
  await displayPokemonAsAscii(pokemonName);
})();
