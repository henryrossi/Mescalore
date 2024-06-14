# Generated by Django 5.0 on 2024-06-13 22:28

import django.db.models.deletion
from django.db import migrations, models

def create_1st_section(apps, schema_editor):
    Recipe = apps.get_model('recipes', 'Recipe')
    IngredientSection = apps.get_model('recipes', 'IngredientSection')
    db_alias = schema_editor.connection.alias
    recipe = Recipe.objects.using(db_alias).all()[0]
    IngredientSection.objects.using(db_alias).create(recipe=recipe, name="default")


def set_default_sections(apps, schema_editor):
    Recipe = apps.get_model('recipes', 'Recipe')
    IngredientSection = apps.get_model('recipes', 'IngredientSection')
    IngredientList = apps.get_model('recipes', 'IngredientList')
    db_alias = schema_editor.connection.alias
    recipes = Recipe.objects.using(db_alias).all()
    for recipe in recipes.iterator():
        # create section
        # add this section to every ingredientlist
        section = IngredientSection.objects.using(db_alias).create(recipe=recipe, name="section")
        ingredients = IngredientList.objects.using(db_alias).filter(recipe=recipe)
        for ingredient in ingredients.iterator():
            ingredient.section = section
            ingredient.save()


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0012_favoriterecipes'),
    ]

    operations = [
        migrations.CreateModel(
            name='IngredientSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.recipe')),
            ],
        ),
        migrations.RunPython(create_1st_section),
        migrations.AddField(
            model_name='ingredientlist',
            name='section',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='recipes.ingredientsection'),
            preserve_default=False,
        ),
        migrations.RunPython(set_default_sections),
    ]   
