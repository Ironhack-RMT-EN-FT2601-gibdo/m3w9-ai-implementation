import { useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/config.services";

function RecipeCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    ingredients: "",
    servings: 1,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
  });
  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientsArray = form.ingredients
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const instructionsArray = form.instructions
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const body = {
      title: form.title.trim(),
      instructions: instructionsArray,
      ingredients: ingredientsArray,
      servings: form.servings,
      isVegan: form.isVegan,
      isVegetarian: form.isVegetarian,
      isGlutenFree: form.isGlutenFree,
    };

    try {
      await service.post("/recipes", body);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateRecipeAI = async () => {
    // function to call the server, and, via some LLM, receive all the details of a new recipe. Then load that info into the state.

    if (!form.title) {
      return // prevents call if no title and expects at least 3 character string.
    }

    setIsGenerating(true);
    // request logic here...
    
  }

  return (
    <div>
      <h1>Create recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="title-input-container">
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <button type="button" disabled={!form.title || isGenerating} onClick={handleGenerateRecipeAI}>
              {isGenerating ? "Generating..." : "Generate 🤖"}
            </button>
          </div>
        </div>

        <div>
          <label>Instructions (one per line)</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Ingredients (one per line)</label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Servings</label>
          <input
            name="servings"
            type="number"
            value={form.servings}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            id="isVegan"
            name="isVegan"
            type="checkbox"
            checked={form.isVegan}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isVegan">Vegan</label>
        </div>

        <div>
          <input
            id="isVegetarian"
            name="isVegetarian"
            type="checkbox"
            checked={form.isVegetarian}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isVegetarian">Vegetarian</label>
        </div>

        <div>
          <input
            id="isGlutenFree"
            name="isGlutenFree"
            type="checkbox"
            checked={form.isGlutenFree}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isGlutenFree">Gluten free</label>
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default RecipeCreatePage;
