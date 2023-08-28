<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPref extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pref_key',
        'pref_value',
    ];
}
