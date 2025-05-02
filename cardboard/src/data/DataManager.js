class DataManager
{
    // --------------------------------
    // Constructor
    // --------------------------------
    constructor()
    {
        this.d_CardData   = new CardData();
        this.d_PackData   = new PackData();
        this.d_RecipeData = new RecipeData();
    }

    // Getters
    // --------------------------------
    GetCardData() { return this.d_CardData;   }
    GetPackData() { return this.d_PackData;   }
    GetRecipes()  { return this.d_RecipeData; }
}