package com.bcb.backend.mysql.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bcb.backend.mysql.dto.request.AccountRequest;
import com.bcb.backend.mysql.dto.request.ChangePasswordRequest;
import com.bcb.backend.mysql.dto.response.AccountResponse;
import com.bcb.backend.mysql.mapper.AccountMapper;
import com.bcb.backend.mysql.model.Account;
import com.bcb.backend.mysql.model.Player;
import com.bcb.backend.mysql.repository.AccountRepository;
import com.bcb.backend.mysql.repository.PlayerRepository;

import java.nio.file.*;

@Service
public class AccountService {

    private static final String ACCOUNT_NOT_FOUND_ID = "Account not found with id: ";
    private static final String ACCOUNT_NOT_FOUND_USERNAME = "Account not found with username: ";
    private static final String USERNAME_ALREADY_EXISTS = "Username already exists";
    private static final String PHONE_NUMBER_LIMIT_EXCEEDED = "This phone number has exceeded the number of registrations.";
    private static final String OLD_PASSWORD_INCORRECT = "Old password is incorrect";

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final PlayerRepository playerRepo;

    public AccountService(AccountRepository accountRepo, PasswordEncoder passwordEncoder, PlayerRepository playerRepo) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.playerRepo = playerRepo;
    }

    public String getIdByUsername(String username) {
        return accountRepo.findByUsername(username)
                .map(Account::getId)
                .orElseThrow(() -> new IllegalArgumentException(ACCOUNT_NOT_FOUND_USERNAME + username));
    }

    public AccountResponse getAccountById(String id) {
        return accountRepo.findById(id)
                .map(AccountMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException(ACCOUNT_NOT_FOUND_ID + id));
    }

    public AccountResponse getAccountByUserName(String username) {
        return accountRepo.findByUsername(username)
                .map(AccountMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException(ACCOUNT_NOT_FOUND_USERNAME + username));
    }

    public List<String> getUsernamesByPhoneNumber(String phoneNumber) {
        return accountRepo.findByPhoneNumber(phoneNumber)
                .stream()
                .map(AccountMapper::toDTO)
                .map(AccountResponse::getUsername)
                .collect(Collectors.toList());
    }

    public boolean isActivatedByUserName(String username) {
        return accountRepo.findByUsername(username)
                .orElseThrow(
                        () -> new IllegalArgumentException("Account could not be found with username: " + username))
                .isActivated();
    }

    public AccountResponse registerAccount(AccountRequest accountRequest, String role) {
        validateAccountRequest(accountRequest);
        validateUsernameUniqueness(accountRequest.getUsername());
        validatePhoneNumberLimit(accountRequest.getPhoneNumber());

        accountRequest.setPassword(passwordEncoder.encode(accountRequest.getPassword()));
        Account newAccount = AccountMapper.toEntity(accountRequest);

        newAccount.setId(GenerationId.generateId("acco"));
        newAccount.setActivated(true);
        newAccount.setRole(role);

        return AccountMapper.toDTO(accountRepo.save(newAccount));
    }

    public AccountResponse registerUserAccount(AccountRequest accountRequest) {

        AccountResponse response = registerAccount(accountRequest, "USER");

        Player newPlayer = Player.builder()
                .id(GenerationId.generateId("play"))
                .gender(null)
                .account(Account.builder()
                        .id(response.getId())
                        .username(response.getUsername())
                        .role(response.getRole())
                        .phoneNumber(response.getPhoneNumber())
                        .role(response.getRole())
                        .build())
                .build();
        playerRepo.save(newPlayer);

        return response;
    }

    public AccountResponse registerManagerAccount(AccountRequest accountRequest) {
        return registerAccount(accountRequest, "MANAGER");
    }

    public String changeStatusAccount(String id, boolean status) {
        Account account = findAccountById(id);
        account.setActivated(status);
        return Boolean.toString(accountRepo.save(account).isActivated());
    }

    public boolean changePassword(String id, ChangePasswordRequest passwordRequest) {
        Account account = findAccountById(id);
        validateOldPassword(account, passwordRequest.getOldPassword());

        account.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        accountRepo.save(account);

        return true;
    }

    public String changePhoneNumber(String id, String newPhoneNumber) {
        validatePhoneNumberLimit(newPhoneNumber);

        Account account = findAccountById(id);
        account.setPhoneNumber(newPhoneNumber);
        accountRepo.save(account);

        return newPhoneNumber;
    }

    public AccountResponse changeRole(String id, String newRole) {

        Account account = findAccountById(id);
        account.setRole(newRole);
        accountRepo.save(account);

        return AccountMapper.toDTO(account);
    }

    private Account findAccountById(String id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(ACCOUNT_NOT_FOUND_ID + id));
    }

    private void validateAccountRequest(AccountRequest accountRequest) {
        if (accountRequest == null) {
            throw new IllegalArgumentException("Account request must not be null");
        }
        if (accountRequest.getUsername() == null || accountRequest.getPassword() == null ||
                accountRequest.getPhoneNumber() == null) {
            throw new IllegalArgumentException("Username, password, and phone number must not be null");
        }
    }

    private void validateUsernameUniqueness(String username) {
        if (accountRepo.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException(USERNAME_ALREADY_EXISTS);
        }
    }

    private void validatePhoneNumberLimit(String phoneNumber) {
        if (getUsernamesByPhoneNumber(phoneNumber).size() >= 3) {
            throw new IllegalArgumentException(PHONE_NUMBER_LIMIT_EXCEEDED);
        }
    }

    private void validateOldPassword(Account account, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new IllegalArgumentException(OLD_PASSWORD_INCORRECT);
        }
    }

    public String uploadImage(String id, MultipartFile file) throws IOException {

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }

        Account branch = accountRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));

        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        String uploadDir = "uploads/images/" + id + "/";
        String fileName = branch.getId() + extension;

        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        branch.setImagePath(uploadDir + fileName);
        accountRepo.save(branch);

        return filePath.toString();

    }
}
