package com.example.meetmates.dto;

import java.time.LocalDateTime;

public class RegisterRequestDto {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Integer age;
    private String role;
    private LocalDateTime dateAcceptationCGU; 


    // GETTERS & SETTERS
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getDateAcceptationCGU() { return dateAcceptationCGU; }
    public void setDateAcceptationCGU(LocalDateTime dateAcceptationCGU) { this.dateAcceptationCGU = dateAcceptationCGU; }
}
