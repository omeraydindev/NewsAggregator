<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPref;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {
            return User::query()
                ->find($request->user()->id)
                ->with('prefs')
                ->first();
        }
        return null;
    }

    public function updatePrefs(Request $request)
    {
        $user = $request->user();
        UserPref::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'pref_key' => $request->input('pref_key'),
            ],
            [
                'pref_value' => $request->input('pref_value') ?? '',
            ]
        );
        return [
            'success' => true,
        ];
    }
}
