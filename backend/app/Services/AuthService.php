<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        // Business logic: hash password, default role
        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'user';

        // Repository call
        $user = $this->userRepository->create($data);
        
        // Authentication logic
        $token = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(array $credentials)
    {
        if (!$token = auth('api')->attempt($credentials)) {
            return null;
        }

        return [
            'user' => auth('api')->user(),
            'token' => $token,
        ];
    }

    public function logout()
    {
        auth('api')->logout();
    }
}
