<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ProductController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        sleep(1);
		return Product::with('categories')->get();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
        Product::unguard();

        $data = Input::all();

        $categories = Input::get('categories');

        unset($data['categories']);

        $product = new Product;

        $product->fill($data);

        $product->save();

        $product->categories()->sync(array_pluck($categories, 'id'));

        $product->load('categories');

        return $product;
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
        Product::unguard();

        $data = Input::all();

        $categories = Input::get('categories');

        unset($data['categories']);

        $product = Product::with('categories')->find($id);

        $product->fill($data);

        $product->description = preg_replace('/\!+$/', '', $product->description);

        $product->save();

        $product->categories()->sync(array_pluck($categories, 'id'));

        $product->load('categories');

        return $product;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		Product::find($id)->delete();
	}

}
