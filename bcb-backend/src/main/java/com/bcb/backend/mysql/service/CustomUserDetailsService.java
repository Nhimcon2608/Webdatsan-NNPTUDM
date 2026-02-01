package com.bcb.backend.mysql.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bcb.backend.mysql.model.Account;
import com.bcb.backend.mysql.repository.AccountRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    public CustomUserDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = account.getRole();

        return new org.springframework.security.core.userdetails.User(
                account.getUsername(),
                account.getPassword(),
                List.of(new SimpleGrantedAuthority(role))
        );
    }
}

