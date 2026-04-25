class Item {

  static UtilitySciencePack = new Item('Utility science pack');
  static ProcessingUnit = new Item('Processing unit');
  static FlyingRobotFrame = new Item('Flying robot frame');
  static LowDensityStructure = new Item('Low density structure');
  static ElectronicCircuit = new Item('Electronic circuit');
  static AdvancedCircuit = new Item('Advanced circuit');
  static SulfuricAcid = new Item('Sulfuric acid');
  static SteelPlate = new Item('Steel plate');
  static Battery = new Item('Battery');
  static ElectricEngineUnit = new Item('Electric engine unit');
  static CopperPlate = new Item('Copper plate');
  static PlasticBar = new Item('Plastic bar');
  static IronPlate = new Item('Iron plate');
  static CopperCable = new Item('Copper cable');
  static Coal = new Item('Coal');
  static PetroleumGas = new Item('Petroleum gas');
  static Sulfur = new Item('Sulfur');
  static Water = new Item('Water');
  static IronOre = new Item('Iron ore');
  static CopperOre = new Item('Copper ore');
  static EngineUnit = new Item('Engine unit');
  static Lubricant = new Item('Lubricant');
  static IronGearWheel = new Item('Iron gear wheel');
  static Pipe = new Item('Pipe');
  static HeavyOil = new Item('Heavy oil');
  static LightOil = new Item('Light oil');
  static CrudeOil = new Item('Crude oil');
  static ExplosiveRocket = new Item('Explosive rocket');
  static Rocket = new Item('Rocket');
  static Explosives = new Item('Explosives');
  static RocketPart = new Item('Rocket part');
  static RocketFuel = new Item('Rocket fuel');
  static SolidFuel = new Item('Solid fuel');
  static RepairPack = new Item('Repair pack');
  static ExpressTransportBelt = new Item('Express transport belt');
  static TungstenPlate = new Item('Tungsten plate');
  static TungstenOre = new Item('Tungsten ore');
  static MoltenIron = new Item('Molten iron');
  static Lava = new Item('Lava');
  static Stone = new Item('Stone');
  static Calcite = new Item('Calcite');
  static MoltenCopper = new Item('Molten copper');
  static IronStick = new Item('Iron stick');
  static StoneBrick = new Item('Stone brick');


  constructor(name) {
    this.name = name;
  }

}

class Building {

  static AssemblingMachine3 = new Building('Assembling machine 3', new Fraction(5, 4));
  static ChemicalPlant = new Building('Chemical plant', new Fraction(1));
  static ElectricFurnace = new Building('Electric furnace', new Fraction(2));
  static OilRefinery = new Building('Oil refinery', new Fraction(1));
  static RocketSilo = new Building('Rocket silo', new Fraction(1));
  static Foundry = new Building('Foundry', new Fraction(4));

  constructor(name, craftingSpeed) {
    this.name = name;
    this.craftingSpeed = craftingSpeed;
  }

}

class ItemStack {

  constructor(item, count) {
    this.item = item;
    this.count = count;
  }

  clone() {
    return new ItemStack(this.item, this.count.clone());
  }

}

class Recipe {

  static TurboTransportBelt = new Recipe('Turbo transport belt (Recipe)',
      [new ItemStack(Item.TurboTransportBelt, new Fraction(1))],
      [new ItemStack(Item.TungstenPlate, new Fraction(5)), new ItemStack(Item.ExpressTransportBelt, new Fraction(1)), new ItemStack(Item.Lubricant, new Fraction(20))],
      new Fraction(1, 2), [Building.Foundry]);
  static TungstenPlate = new Recipe('Tungsten plate (Recipe)',
      [new ItemStack(Item.TungstenPlate, new Fraction(1))],
      [new ItemStack(Item.TungstenOre, new Fraction(4)), new ItemStack(Item.MoltenIron, new Fraction(10))],
      new Fraction(10), [Building.Foundry]);
  static MoltenIronFromLava = new Recipe('Molten iron from lava (Recipe)',
      [new ItemStack(Item.Stone, new Fraction(10)), new ItemStack(Item.MoltenIron, new Fraction(250))],
      [new ItemStack(Item.Calcite, new Fraction(1)), new ItemStack(Item.Lava, new Fraction(500))],
      new Fraction(16), [Building.Foundry]);
  static CastingIron = new Recipe('2 × Casting iron (Recipe)',
      [new ItemStack(Item.IronPlate, new Fraction(2))],
      [new ItemStack(Item.MoltenIron, new Fraction(20))],
      new Fraction(16, 5), [Building.Foundry]);
  static MoltenCopperFromLava = new Recipe('Molten copper from lava (Recipe)',
      [new ItemStack(Item.Stone, new Fraction(10)), new ItemStack(Item.MoltenCopper, new Fraction(250))],
      [new ItemStack(Item.Calcite, new Fraction(1)), new ItemStack(Item.Lava, new Fraction(500))],
      new Fraction(16), [Building.Foundry]);
  static CastingCopper = new Recipe('2 × Casting copper (Recipe)',
      [new ItemStack(Item.CopperPlate, new Fraction(2))],
      [new ItemStack(Item.MoltenCopper, new Fraction(20))],
      new Fraction(16, 5), [Building.Foundry]);
  static CastingSteel = new Recipe('Casting steel (Recipe)',
      [new ItemStack(Item.SteelPlate, new Fraction(1))],
      [new ItemStack(Item.MoltenIron, new Fraction(30))],
      new Fraction(16, 5), [Building.Foundry]);
  static CastingIronGearWheel = new Recipe('Casting iron gear wheel (Recipe)',
      [new ItemStack(Item.IronGearWheel, new Fraction(1))],
      [new ItemStack(Item.MoltenIron, new Fraction(10))],
      new Fraction(1), [Building.Foundry]);
  static CastingIronStick = new Recipe('4 × Casting iron stick (Recipe)',
      [new ItemStack(Item.IronStick, new Fraction(4))],
      [new ItemStack(Item.MoltenIron, new Fraction(20))],
      new Fraction(1), [Building.Foundry]);
  static CastingLowDensityStructure = new Recipe('Casting low density structure (Recipe)',
      [new ItemStack(Item.LowDensityStructure, new Fraction(1))],
      [new ItemStack(Item.PlasticBar, new Fraction(5)), new ItemStack(Item.MoltenIron, new Fraction(80)), new ItemStack(Item.MoltenCopper, new Fraction(250))],
      new Fraction(15), [Building.Foundry]);
  static ConcreteFromMoltenIron = new Recipe('10 × Concrete from molten iron (Recipe)',
      [new ItemStack(Item.Concrete, new Fraction(10))],
      [new ItemStack(Item.StoneBrick, new Fraction(5)), new ItemStack(Item.MoltenIron, new Fraction(20)), new ItemStack(Item.Water, new Fraction(100))],
      new Fraction(10), [Building.Foundry]);
  static CastingCopperCable = new Recipe('2 × Casting copper cable (Recipe)',
      [new ItemStack(Item.CopperCable, new Fraction(2))],
      [new ItemStack(Item.MoltenCopper, new Fraction(5))],
      new Fraction(1), [Building.Foundry]);
  static UtilitySciencePack = new Recipe('3 × Utility science pack (Recipe)',
      [new ItemStack(Item.UtilitySciencePack, new Fraction(3))],
      [new ItemStack(Item.ProcessingUnit, new Fraction(2)), new ItemStack(Item.FlyingRobotFrame, new Fraction(1)), new ItemStack(Item.LowDensityStructure, new Fraction(3))],
      new Fraction(21), [Building.AssemblingMachine3]);
  static ProcessingUnit = new Recipe('Processing unit (Recipe)',
      [new ItemStack(Item.ProcessingUnit, new Fraction(1))],
      [new ItemStack(Item.ElectronicCircuit, new Fraction(20)), new ItemStack(Item.AdvancedCircuit, new Fraction(2)), new ItemStack(Item.SulfuricAcid, new Fraction(5))],
      new Fraction(10), [Building.AssemblingMachine3]);
  static FlyingRobotFrame = new Recipe('Flying robot frame (Recipe)',
      [new ItemStack(Item.FlyingRobotFrame, new Fraction(1))],
      [new ItemStack(Item.SteelPlate, new Fraction(1)), new ItemStack(Item.Battery, new Fraction(2)), new ItemStack(Item.ElectronicCircuit, new Fraction(3)), new ItemStack(Item.ElectricEngineUnit, new Fraction(1))],
      new Fraction(20), [Building.AssemblingMachine3]);
  static LowDensityStructure = new Recipe('Low density structure (Recipe)',
      [new ItemStack(Item.LowDensityStructure, new Fraction(1))],
      [new ItemStack(Item.CopperPlate, new Fraction(20)), new ItemStack(Item.SteelPlate, new Fraction(2)), new ItemStack(Item.PlasticBar, new Fraction(5))],
      new Fraction(15), [Building.AssemblingMachine3]);
  static ElectronicCircuit = new Recipe('Electronic circuit (Recipe)',
      [new ItemStack(Item.ElectronicCircuit, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(1)), new ItemStack(Item.CopperCable, new Fraction(3))],
      new Fraction(1, 2), [Building.AssemblingMachine3]);
  static CopperCable = new Recipe('2 × Copper cable (Recipe)',
      [new ItemStack(Item.CopperCable, new Fraction(2))],
      [new ItemStack(Item.CopperPlate, new Fraction(1))],
      new Fraction(1, 2), [Building.AssemblingMachine3]);
  static AdvancedCircuit = new Recipe('Advanced circuit (Recipe)',
      [new ItemStack(Item.AdvancedCircuit, new Fraction(1))],
      [new ItemStack(Item.PlasticBar, new Fraction(2)), new ItemStack(Item.CopperCable, new Fraction(4)), new ItemStack(Item.ElectronicCircuit, new Fraction(2))],
      new Fraction(6), [Building.AssemblingMachine3]);
  static PlasticBar = new Recipe('2 × Plastic bar (Recipe)',
      [new ItemStack(Item.PlasticBar, new Fraction(2))],
      [new ItemStack(Item.Coal, new Fraction(1)), new ItemStack(Item.PetroleumGas, new Fraction(20))],
      new Fraction(1), [Building.ChemicalPlant]);
  static SulfuricAcid = new Recipe('50 × Sulfuric acid (Recipe)',
      [new ItemStack(Item.SulfuricAcid, new Fraction(50))],
      [new ItemStack(Item.IronPlate, new Fraction(1)), new ItemStack(Item.Sulfur, new Fraction(5)), new ItemStack(Item.Water, new Fraction(100))],
      new Fraction(1), [Building.ChemicalPlant]);
  static Sulfur = new Recipe('2 × Sulfur (Recipe)',
      [new ItemStack(Item.Sulfur, new Fraction(2))],
      [new ItemStack(Item.Water, new Fraction(30)), new ItemStack(Item.PetroleumGas, new Fraction(30))],
      new Fraction(1), [Building.ChemicalPlant]);
  static IronPlate = new Recipe('Iron plate (Recipe)',
      [new ItemStack(Item.IronPlate, new Fraction(1))],
      [new ItemStack(Item.IronOre, new Fraction(1))],
      new Fraction(16, 5), [Building.ElectricFurnace]);
  static CopperPlate = new Recipe('Copper plate (Recipe)',
      [new ItemStack(Item.CopperPlate, new Fraction(1))],
      [new ItemStack(Item.CopperOre, new Fraction(1))],
      new Fraction(16, 5), [Building.ElectricFurnace]);
  static SteelPlate = new Recipe('Steel plate (Recipe)',
      [new ItemStack(Item.SteelPlate, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(5))],
      new Fraction(16), [Building.ElectricFurnace]);
  static Battery = new Recipe('Battery (Recipe)',
      [new ItemStack(Item.Battery, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(1)), new ItemStack(Item.CopperPlate, new Fraction(1)), new ItemStack(Item.SulfuricAcid, new Fraction(20))],
      new Fraction(4), [Building.ChemicalPlant]);
  static ElectricEngineUnit = new Recipe('Electric engine unit (Recipe)',
      [new ItemStack(Item.ElectricEngineUnit, new Fraction(1))],
      [new ItemStack(Item.ElectronicCircuit, new Fraction(2)), new ItemStack(Item.EngineUnit, new Fraction(1)), new ItemStack(Item.Lubricant, new Fraction(15))],
      new Fraction(10), [Building.AssemblingMachine3]);
  static EngineUnit = new Recipe('Engine unit (Recipe)',
      [new ItemStack(Item.EngineUnit, new Fraction(1))],
      [new ItemStack(Item.SteelPlate, new Fraction(1)), new ItemStack(Item.IronGearWheel, new Fraction(1)), new ItemStack(Item.Pipe, new Fraction(2))],
      new Fraction(10), [Building.AssemblingMachine3]);
  static IronGearWheel = new Recipe('Iron gear wheel (Recipe)',
      [new ItemStack(Item.IronGearWheel, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(2))],
      new Fraction(1, 2), [Building.AssemblingMachine3]);
  static Pipe = new Recipe('Pipe (Recipe)',
      [new ItemStack(Item.Pipe, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(1))],
      new Fraction(1, 2), [Building.AssemblingMachine3]);
  static Lubricant = new Recipe('10 × Lubricant (Recipe)',
      [new ItemStack(Item.Lubricant, new Fraction(10))],
      [new ItemStack(Item.HeavyOil, new Fraction(10))],
      new Fraction(1), [Building.ChemicalPlant]);
  static AdvancedOilProcessing = new Recipe('Advanced oil processing (Recipe)',
      [new ItemStack(Item.HeavyOil, new Fraction(25)), new ItemStack(Item.LightOil, new Fraction(45)), new ItemStack(Item.PetroleumGas, new Fraction(55))],
      [new ItemStack(Item.Water, new Fraction(50)), new ItemStack(Item.CrudeOil, new Fraction(100))],
      new Fraction(5), [Building.OilRefinery]);
  static ExplosiveRocket = new Recipe('Explosive rocket (Recipe)',
      [new ItemStack(Item.ExplosiveRocket, new Fraction(1))],
      [new ItemStack(Item.Explosives, new Fraction(2)), new ItemStack(Item.Rocket, new Fraction(1))],
      new Fraction(8), [Building.AssemblingMachine3]);
  static Rocket = new Recipe('Rocket (Recipe)',
      [new ItemStack(Item.Rocket, new Fraction(1))],
      [new ItemStack(Item.IronPlate, new Fraction(2)), new ItemStack(Item.Explosives, new Fraction(1))],
      new Fraction(4), [Building.AssemblingMachine3]);
  static Explosives = new Recipe('2 × Explosives (Recipe)',
      [new ItemStack(Item.Explosives, new Fraction(2))],
      [new ItemStack(Item.Coal, new Fraction(1)), new ItemStack(Item.Sulfur, new Fraction(1)), new ItemStack(Item.Water, new Fraction(10))],
      new Fraction(4), [Building.ChemicalPlant]);
  static RocketPart = new Recipe('Rocket part (Recipe)',
      [new ItemStack(Item.RocketPart, new Fraction(1))],
      [new ItemStack(Item.ProcessingUnit, new Fraction(1)), new ItemStack(Item.LowDensityStructure, new Fraction(1)), new ItemStack(Item.RocketFuel, new Fraction(1))],
      new Fraction(3), [Building.RocketSilo]);
  static RocketFuel = new Recipe('Rocket fuel (Recipe)',
      [new ItemStack(Item.RocketFuel, new Fraction(1))],
      [new ItemStack(Item.SolidFuel, new Fraction(10)), new ItemStack(Item.LightOil, new Fraction(10))],
      new Fraction(15), [Building.AssemblingMachine3]);
  static SolidFuelHeavyOil = new Recipe('Solid fuel from heavy oil (Recipe)',
      [new ItemStack(Item.SolidFuel, new Fraction(1))],
      [new ItemStack(Item.HeavyOil, new Fraction(20))],
      new Fraction(1), [Building.ChemicalPlant]);
  static RepairPack = new Recipe('Repair pack (Recipe)',
      [new ItemStack(Item.RepairPack, new Fraction(1))],
      [new ItemStack(Item.IronGearWheel, new Fraction(2)), new ItemStack(Item.ElectronicCircuit, new Fraction(2))],
      new Fraction(1, 2), [Building.AssemblingMachine3]);

  constructor(name, outputs, inputs, time, buildings) {
    this.name = name;
    this.outputs = outputs;
    this.inputs = inputs;
    this.time = time;
    this.buildings = buildings;
  }

  static getRecipes(item) {
    return Object.keys(Recipe).map((key) => {
      return Recipe[key];
    }).filter((recipe) => {
      return recipe instanceof Recipe;
    }).filter((recipe) => {
      return recipe.outputs.map((output) => {
        return output.item;
      }).includes(item);
    });
  }

  static getByName(name) {
    return Object.keys(Recipe).map((key) => {
      return Recipe[key];
    }).filter((recipe) => {
      return recipe instanceof Recipe;
    }).filter((recipe) => {
      return recipe.name == name;
    });
  }

}



class RecipeGraph {

  constructor(itemstack) {
    // generate nodes
    this.nodes = this.getRecipes(Recipe.getRecipes(itemstack.item)[0]).map((recipe) => {
      return new RecipeGraphNode(recipe);
    });

    // generate edges
    this.nodes.forEach((node) => {
      node.recipe.inputs.forEach((input) => {
        this.nodes.forEach((inputnode) => {
          inputnode.recipe.outputs.forEach((output) => {
            if (output.item == input.item)
              node.inputs.push(inputnode);
          });
        });
      });
      node.recipe.outputs.forEach((output) => {
        this.nodes.forEach((outputnode) => {
          outputnode.recipe.inputs.forEach((input) => {
            if (output.item == input.item)
              node.outputs.push(outputnode);
          });
        });
      });
      node.inputs = [...new Set(node.inputs)];
      node.outputs = [...new Set(node.outputs)];
    });

    // set root count
    this.root = this.nodes.filter((node) => {
      return node.recipe.outputs.map((output) => {
        return output.item;
      }).includes(itemstack.item);
    })[0];
    this.root.recipe.outputs.forEach((output) => {
      if (output.item == itemstack.item) {
        this.root.increaseCount(itemstack.count.div(output.count.div(this.root.recipe.time)));
        this.root.increase = this.root.count;
      }
    });

    // balance everything with a bfs
    var queue = [this.root];
    while (queue.length > 0) {
      var node = queue.shift();
      node.inputs.forEach((inputnode) => {
        queue.push(inputnode);
        inputnode.adjustCount(node.recipe.inputs.map((input) => {
          return new ItemStack(input.item, input.count.mul(node.increase).div(node.recipe.time));
        }));
      });
      node.increase = new Fraction(0);
    }
  }

  getRecipes(recipe) {
    var recipes = [recipe];
    recipe.inputs.forEach((input) => {
      var recipe = Recipe.getRecipes(input.item)[0];
      if (recipe == null)
        return;
      recipes.push(...this.getRecipes(recipe));
    });
    return [...new Set(recipes)];
  }

  getOverview() {
    var overview = {
      inputs: {},
      outputs: {},
      recipes: {}
    };
    this.nodes.forEach((node) => {
      node.recipe.inputs.forEach((input) => {
        overview.inputs[input.item.name] = (overview.inputs[input.item.name] || new Fraction(0)).add(input.count.div(node.recipe.time).mul(node.count));
      });
      node.recipe.outputs.forEach((output) => {
        overview.outputs[output.item.name] = (overview.outputs[output.item.name] || new Fraction(0)).add(output.count.div(node.recipe.time).mul(node.count));
      });
      overview.recipes[node.recipe.name] = (overview.recipes[node.recipe.name] || new Fraction(0)).add(node.count);
    });
    // calculate input within machinery
    Object.keys(overview.inputs).forEach((input) => {
      if (!Object.keys(overview.outputs).includes(input))
        return;

      var crossfeed = overview.outputs[input].min(overview.inputs[input]);
      overview.outputs[input] = overview.outputs[input].sub(crossfeed);
      overview.inputs[input] = overview.inputs[input].sub(crossfeed);
    });
    // remove 0 inputs and outputs
    [...Object.keys(overview.inputs)].filter((input) => {
      return !overview.inputs[input].gt(new Fraction(0));
    }).forEach((input) => {
      delete overview.inputs[input];
    });
    [...Object.keys(overview.outputs)].filter((output) => {
      return !overview.outputs[output].gt(new Fraction(0));
    }).forEach((output) => {
      delete overview.outputs[output];
    });

    return overview;
  }

}

class RecipeGraphNode {

  constructor(recipe) {
    this.recipe = recipe;
    this.count = new Fraction(0);
    this.inputs = [];
    this.outputs = [];

    this.increase = new Fraction(0);
    this.unused = {};
    this.used = {};
    this.recipe.outputs.forEach((output) => {
      this.unused[output.item.name] = new Fraction(0);
      this.used[output.item.name] = new Fraction(0);
    });
  }

  adjustCount(goals) {
    goals.forEach((goal) => {
      this.recipe.outputs.forEach((output) => {
        if (goal.item == output.item) {
          var used = goal.count.min(this.unused[output.item.name]);
          this.unused[output.item.name] = this.unused[output.item.name].sub(used);
          this.used[output.item.name] = this.used[output.item.name].add(used);
          
          var count = goal.count.sub(used);
          if (count.gt(new Fraction(0))) {
            this.increaseCount(count.div(output.count.div(this.recipe.time)));
            this.used[output.item.name] = this.used[output.item.name].add(this.unused[output.item.name]);
            this.unused[output.item.name] = new Fraction(0);
          }
        }
      });
    });
  }

  increaseCount(count) {
    this.recipe.outputs.forEach((output) => {
      this.unused[output.item.name] = this.unused[output.item.name].add(output.count.div(this.recipe.time).mul(count));
    });
    this.count = this.count.add(count);
    this.increase = this.increase.add(count);
  }

}



var graph = null;
var graphChanged = false;

window.addEventListener('load', () => {
  // graph = new RecipeGraph(new ItemStack(Item.UtilitySciencePack, new Fraction(1)));
  // graph = new RecipeGraph(new ItemStack(Item.RocketPart, new Fraction(1, 3)));
  graph = new RecipeGraph(new ItemStack(Item.RepairPack, new Fraction(15, 2)));
  graphChanged = true;
  console.log(graph.getOverview());
});