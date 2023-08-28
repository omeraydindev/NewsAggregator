<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'origin',
        'source_id',
        'published_at',
        'description',
        'web_url',
        'image_url',
    ];

    public function source(): BelongsTo
    {
        return $this->belongsTo(Source::class, 'source_id', 'id')
            ->select(['id', 'name']);
    }

    public function authors(): HasMany
    {
        return $this->hasMany(ArticleAuthor::class, 'article_id', 'id');
    }
}
