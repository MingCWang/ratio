"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Share,
  Save,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderIcon,
  Search,
  MoreVertical,
} from "lucide-react"

type Screen = "recipe-library" | "paste-recipe" | "scan-ingredients" | "choose-servings" | "results" | "save-recipe"

interface Ingredient {
  name: string
  quantity: string
  unit: string
  substitution?: string
}

interface Recipe {
  id: string
  name: string
  servings: number
  dateCreated: string
  folderId?: string
  ingredients: Ingredient[]
}

interface Folder {
  id: string
  name: string
  color: string
}

export default function SmartCookApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("recipe-library")
  const [servings, setServings] = useState(4)
  const [recipe, setRecipe] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [scaledIngredients, setScaledIngredients] = useState<Ingredient[]>([])
  const [recipeName, setRecipeName] = useState("")

  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "Chocolate Chip Cookies",
      servings: 4,
      dateCreated: "2024-01-15",
      folderId: "desserts",
      ingredients: [
        { name: "All-purpose flour", quantity: "2", unit: "cups" },
        { name: "Butter", quantity: "1", unit: "cup" },
        { name: "Sugar", quantity: "3/4", unit: "cup" },
      ],
    },
    {
      id: "2",
      name: "Pasta Carbonara",
      servings: 2,
      dateCreated: "2024-01-10",
      folderId: "dinner",
      ingredients: [
        { name: "Spaghetti", quantity: "200", unit: "g" },
        { name: "Eggs", quantity: "2", unit: "large" },
        { name: "Parmesan", quantity: "1/2", unit: "cup" },
      ],
    },
    {
      id: "3",
      name: "Green Smoothie",
      servings: 1,
      dateCreated: "2024-01-12",
      ingredients: [
        { name: "Spinach", quantity: "1", unit: "cup" },
        { name: "Banana", quantity: "1", unit: "medium" },
        { name: "Almond milk", quantity: "1", unit: "cup" },
      ],
    },
  ])

  const [folders, setFolders] = useState<Folder[]>([
    { id: "desserts", name: "Desserts", color: "bg-pink-100" },
    { id: "dinner", name: "Dinner", color: "bg-blue-100" },
    { id: "breakfast", name: "Breakfast", color: "bg-yellow-100" },
  ])

  const mockIngredients: Ingredient[] = [
    { name: "All-purpose flour", quantity: "2", unit: "cups", substitution: "Whole wheat flour" },
    { name: "Olive oil", quantity: "3", unit: "tbsp" },
    { name: "Salt", quantity: "1", unit: "tsp" },
    { name: "Sugar", quantity: "2", unit: "tbsp", substitution: "Honey" },
    { name: "Eggs", quantity: "2", unit: "large" },
  ]

  const handleScaleRecipe = () => {
    const scaled = mockIngredients.map((ingredient) => ({
      ...ingredient,
      quantity: (Number.parseFloat(ingredient.quantity) * (servings / 4)).toString(),
    }))
    setScaledIngredients(scaled)
    setCurrentScreen("results")
  }

  const handleScanIngredients = () => {
    setIngredients(mockIngredients)
    setCurrentScreen("choose-servings")
  }

  const handleTakePicture = () => {
    setCurrentScreen("scan-ingredients")
  }

  const handleConfirmServings = () => {
    const scaled = mockIngredients.map((ingredient) => ({
      ...ingredient,
      quantity: (Number.parseFloat(ingredient.quantity) * (servings / 4)).toString(),
    }))
    setScaledIngredients(scaled)
    setCurrentScreen("results")
  }

  const handleSaveRecipe = () => {
    setCurrentScreen("save-recipe")
  }

  const handleConfirmSave = (folderId?: string) => {
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: recipeName || "Untitled Recipe",
      servings,
      dateCreated: new Date().toISOString().split("T")[0],
      folderId,
      ingredients: scaledIngredients,
    }
    setSavedRecipes([newRecipe, ...savedRecipes])
    setCurrentScreen("recipe-library")
    // Reset form
    setRecipe("")
    setRecipeName("")
    setServings(4)
    setScaledIngredients([])
  }

  const renderRecipeLibraryScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-black">SmartCook</h1>
            <p className="text-gray-600">Your recipe collection</p>
          </div>
          <Button
            onClick={() => setCurrentScreen("paste-recipe")}
            className="bg-black hover:bg-gray-800 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Recipe
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black">Folders</h3>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
              <FolderIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${folder.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                    <FolderIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-black">{folder.name}</div>
                  <div className="text-xs text-gray-500">
                    {savedRecipes.filter((r) => r.folderId === folder.id).length} recipes
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-black">Recent Recipes</h3>

          <div className="space-y-3">
            {savedRecipes.map((recipe) => (
              <Card key={recipe.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-black">{recipe.name}</h4>
                        {recipe.folderId && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            {folders.find((f) => f.id === recipe.folderId)?.name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {recipe.servings} servings • {recipe.dateCreated}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{recipe.ingredients.length} ingredients</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPasteRecipeScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen("recipe-library")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-black">New Recipe</h1>
          <p className="text-gray-600 text-lg">Start by pasting your recipe</p>
        </div>

        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-6">
            <input
              type="text"
              placeholder="Recipe name..."
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            />
            <Textarea
              placeholder="Paste your recipe here..."
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
              className="min-h-48 border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleTakePicture}
          disabled={!recipe.trim()}
          className="w-full h-14 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg text-lg font-medium"
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Picture of Ingredients
        </Button>
      </div>
    </div>
  )

  const renderScanIngredientsScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen("paste-recipe")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">Detected Ingredients</h2>
          <p className="text-gray-600">We found these ingredients in your image</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mockIngredients.map((ingredient, index) => (
            <Card key={index} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-medium text-black">
                  {ingredient.quantity} {ingredient.unit}
                </div>
                <div className="text-sm text-gray-600 mt-1">{ingredient.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => setCurrentScreen("choose-servings")}
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-lg text-lg font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  )

  const renderChooseServingsScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen("scan-ingredients")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-black">Choose Servings</h2>
          <p className="text-gray-600">How many people are you cooking for?</p>
        </div>

        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="rounded-full border-gray-300 hover:bg-gray-100 w-16 h-16"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <div className="text-6xl font-semibold text-black min-w-[120px] text-center">{servings}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServings(servings + 1)}
                className="rounded-full border-gray-300 hover:bg-gray-100 w-16 h-16"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleConfirmServings}
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-lg text-lg font-medium"
        >
          Scale Recipe
        </Button>
      </div>
    </div>
  )

  const renderResultsScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen("choose-servings")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">Scaled Recipe</h2>
          <p className="text-gray-600">For {servings} servings</p>
        </div>

        <div className="space-y-3">
          {scaledIngredients.map((ingredient, index) => (
            <Card key={index} className="border border-gray-200 rounded-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-medium text-black">
                      {Number.parseFloat(ingredient.quantity).toFixed(ingredient.quantity.includes(".") ? 1 : 0)}{" "}
                      {ingredient.unit}
                    </div>
                    <div className="text-gray-600 mt-1">{ingredient.name}</div>
                    {ingredient.substitution && (
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        Alt: {ingredient.substitution}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handleSaveRecipe}
            variant="outline"
            className="flex-1 h-12 border-gray-300 rounded-lg hover:bg-gray-100 bg-transparent"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Recipe
          </Button>
          <Button variant="outline" className="flex-1 h-12 border-gray-300 rounded-lg hover:bg-gray-100 bg-transparent">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )

  const renderSaveRecipeScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen("results")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">Save Recipe</h2>
          <p className="text-gray-600">Choose a folder or save without one</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleConfirmSave()}
            variant="outline"
            className="w-full h-12 border-gray-300 rounded-lg hover:bg-gray-100 bg-transparent justify-start"
          >
            <Save className="w-4 h-4 mr-3" />
            Save without folder
          </Button>

          {folders.map((folder) => (
            <Button
              key={folder.id}
              onClick={() => handleConfirmSave(folder.id)}
              variant="outline"
              className="w-full h-12 border-gray-300 rounded-lg hover:bg-gray-100 bg-transparent justify-start"
            >
              <div className={`w-4 h-4 ${folder.color} rounded mr-3 flex items-center justify-center`}>
                <FolderIcon className="w-3 h-3 text-gray-600" />
              </div>
              Save to {folder.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {currentScreen === "recipe-library" && renderRecipeLibraryScreen()}
      {currentScreen === "paste-recipe" && renderPasteRecipeScreen()}
      {currentScreen === "scan-ingredients" && renderScanIngredientsScreen()}
      {currentScreen === "choose-servings" && renderChooseServingsScreen()}
      {currentScreen === "results" && renderResultsScreen()}
      {currentScreen === "save-recipe" && renderSaveRecipeScreen()}
    </div>
  )
}
