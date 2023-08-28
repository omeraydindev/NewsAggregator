<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ArticlesController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::query()
            ->with(['source'])
            ->orderByDesc('published_at')
            ->where(function ($query) use ($request) {
                if ($request->has('categories') && !empty($request->get('categories'))) {
                    $query->whereIn('category', explode(',', $request->get('categories')));
                }
            })
            ->where(function ($query) use ($request) {
                if ($request->has('origins') && !empty($request->get('origins'))) {
                    $query->whereIn('origin', explode(',', $request->get('origins')));
                }
            })
            ->where(function ($query) use ($request) {
                if ($request->has('date_range') && !empty($request->get('date_range'))) {
                    $query->whereBetween(
                        'published_at',
                        collect(explode(',', $request->get('date_range')))
                            ->map(fn($date) => Carbon::createFromTimestamp($date))
                            ->toArray()
                    );
                }
            })
            ->where(function ($query) use ($request) {
                if ($request->has('q') && !empty($request->get('q'))) {
                    $q = $request->get('q');

                    $query->where('title', 'like', '%' . trim($q) . '%')
                        ->orWhere('description', 'like', '%' . trim($q) . '%');
                }
            })
            ->where(function ($query) use ($request) {
                if ($request->has('keywords') && !empty($request->get('keywords'))) {
                    $keywords = explode(',', $request->get('keywords'));

                    $query->where(function ($query) use ($keywords) {
                        foreach ($keywords as $keyword) {
                            $query->orWhere('title', 'like', '%' . trim($keyword) . '%')
                                ->orWhere('description', 'like', '%' . trim($keyword) . '%');
                        }
                    });
                }
            })
            ->paginate(20);

        return $articles;
    }

    public function filterData(Request $request)
    {
        $categories = Article::query()
            ->select(['category'])
            ->distinct()
            ->get()
            ->pluck('category');

        $origins = Article::query()
            ->select(['origin'])
            ->distinct()
            ->get()
            ->pluck('origin');

        return [
            'categories' => $categories,
            'origins' => $origins,
        ];
    }
}
