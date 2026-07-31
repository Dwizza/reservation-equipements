<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth('api')->check() && auth('api')->user()->isAdmin()) {
            return $next($request);
        }

        return response()->json(['error' => 'Access denied. Admins only.'], 403);
    }
}