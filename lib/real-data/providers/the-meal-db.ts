import { realDataConfig } from "@/config/real-data";
import { fixtureRecipe } from "../fixtures";
import { compactParams, fetchJson } from "../http";
import type { RealDataResult, RecipeSummary } from "../types";

type MealDbMeal = {
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
  idMeal?: string;
  strArea?: string;
  strCategory?: string;
  strInstructions?: string;
  strMeal?: string;
  strMealThumb?: string;
  strSource?: string;
};

type MealDbResponse = {
  meals?: MealDbMeal[] | null;
};

function normalizeMeal(meal: MealDbMeal | undefined): RecipeSummary {
  if (!meal) {
    return fixtureRecipe;
  }

  const ingredients: string[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim();

    if (ingredient) {
      ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
    }
  }

  return {
    area: meal.strArea,
    category: meal.strCategory,
    id: meal.idMeal ?? fixtureRecipe.id,
    ingredients,
    instructions: meal.strInstructions ?? "",
    name: meal.strMeal ?? "Untitled recipe",
    sourceUrl: meal.strSource,
    thumbnailUrl: meal.strMealThumb
  };
}

export async function searchMealDbRecipe(query: string): Promise<RealDataResult<RecipeSummary[]>> {
  const params = compactParams({ s: query });
  const raw = await fetchJson<MealDbResponse>(
    `${realDataConfig.providers.theMealDb.baseUrl}/search.php?${params}`,
    {
      fallback: { meals: [fixtureRecipe as unknown as MealDbMeal] },
      source: "the-meal-db"
    }
  );

  if (raw.fallback) {
    return {
      data: [fixtureRecipe],
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: (raw.data.meals ?? []).map(normalizeMeal),
    fallback: false,
    source: "the-meal-db"
  };
}

export async function fetchRandomMealDbRecipe(): Promise<RealDataResult<RecipeSummary>> {
  const raw = await fetchJson<MealDbResponse>(
    `${realDataConfig.providers.theMealDb.baseUrl}/random.php`,
    {
      fallback: { meals: [fixtureRecipe as unknown as MealDbMeal] },
      source: "the-meal-db"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureRecipe,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: normalizeMeal(raw.data.meals?.[0]),
    fallback: false,
    source: "the-meal-db"
  };
}
