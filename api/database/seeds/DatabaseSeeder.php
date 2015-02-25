<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();

        $faker = Faker\Factory::create();

		$product_1 = App\Product::create([
			'name' => 'ACME Widget',
			'description' => 'ACME Widget can ' . $faker->bs
		]);

		$product_2 = App\Product::create([
			'name' => 'ACME Widget S',
			'description' => 'ACME Widget S can ' . $faker->bs
		]);

		$product_3 = App\Product::create([
			'name' => 'ACME Widget Plus',
			'description' =>'ACME Widget Plus can ' . $faker->bs
		]);

		$category_1 = App\Category::create([
			'name' => $cat1 = 'Electronics',
			'short_name' => Str::slug($cat1)
		]);

		$category_2 = App\Category::create([
			'name' => $cat2 = 'Photography',
			'short_name' => Str::slug($cat2)
		]);

		$category_3 = App\Category::create([
			'name' => $cat3 = 'Books',
			'short_name' => Str::slug($cat3)
		]);

		$product_1->categories()->sync([1, 2]);
		$product_2->categories()->sync([3]);
		$product_2->categories()->sync([1]);

		// $this->call('UserTableSeeder');
	}

}
