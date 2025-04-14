import fetch from "node-fetch";
import asciifyImage from "asciify-image";
import readline from "readline";

const limit = 10000;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getAllPokemonNames() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
    );
    const data = await response.json();
    return data.results.map((pokemon) => pokemon.name);
  } catch (error) {
    console.error("Error fetching Pokémon names:", error);
    return [];
  }
}

async function getPokemonDetails(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`,
    );
    const data = await response.json();
    // Use official artwork for better resolution
    const image =
      data.sprites.other?.["official-artwork"]?.front_default ||
      data.sprites.front_default;
    return {
      image,
      id: data.id,
      types: data.types.map((typeInfo) => typeInfo.type.name).join(", "),
      abilities: data.abilities
        .map((abilityInfo) => abilityInfo.ability.name)
        .join(", "),
      weight: data.weight,
    };
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    throw error;
  }
}

async function displayPokemonAsAscii(pokemonName) {
  try {
    const { image, id, types, abilities, weight } =
      await getPokemonDetails(pokemonName);
    if (!image) {
      console.log("Could not find image for this Pokémon.");
      return;
    }

    const options = {
      fit: "box",
      width: Math.min(process.stdout.columns, 100), // Increased for higher resolution
      height: Math.min(Math.floor(process.stdout.rows / 2), 50), // Increase height as well
    };

    // Print Pokémon information
    console.log(`\nPokémon ID: ${id}`);
    console.log(`Name: ${pokemonName}`);
    console.log(`Types: ${types}`);
    console.log(`Abilities: ${abilities}`);
    console.log(`Weight: ${weight} (hectograms)`);

    console.log("\nASCII Art:\n");

    asciifyImage(image, options, (err, asciified) => {
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
  const pokemonNames = await getAllPokemonNames();

  return new Promise((resolve) => {
    rl.question(
      "Enter the name or part of the name of the Pokémon to search: ",
      (input) => {
        const search = input.toLowerCase().trim();
        const matches = pokemonNames.filter((name) => name.includes(search));

        if (matches.length === 0) {
          console.log("No matches found.");
          rl.close();
          return;
        }

        console.log("Matches found:");
        matches.forEach((name, index) => {
          console.log(`${index + 1}: ${name}`);
        });

        rl.question(
          "Enter the number of the Pokémon you'd like to see: ",
          (numberInput) => {
            const selectedIndex = parseInt(numberInput.trim(), 10) - 1;

            if (selectedIndex >= 0 && selectedIndex < matches.length) {
              resolve(matches[selectedIndex]);
            } else {
              console.log("Invalid selection.");
              rl.close();
            }
          },
        );
      },
    );
  });
}

(async () => {
  const pokemonName = await getUserInput();
  if (pokemonName) {
    await displayPokemonAsAscii(pokemonName);
  }
  rl.close();
})();
