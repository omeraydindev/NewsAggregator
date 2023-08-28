<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("source_id");
            $table->string("title");
            $table->string("category");
            $table->string("origin");
            $table->dateTime("published_at");
            $table->string("description", 1000);
            $table->string("web_url", 1000);
            $table->string("image_url", 1000);
            $table->timestamps();

            // $table->foreign("source_id")->references("id")->on("sources");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
