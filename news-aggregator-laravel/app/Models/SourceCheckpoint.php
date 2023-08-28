<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SourceCheckpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_id',
        'scrape_month',
    ];
}
