package com.employee.management.employee.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT Token Provider for Employee Service
 *
 * Handles JWT token validation and extraction.
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:this-is-a-very-long-secret-key-for-jwt-token-generation-must-be-at-least-64-characters-long-abc123}")
    private String jwtSecret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Get username from JWT token
     */
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // Token has expired
        } catch (UnsupportedJwtException ex) {
            // Token is unsupported
        } catch (MalformedJwtException ex) {
            // Token is malformed
        } catch (SignatureException ex) {
            // Token signature is invalid
        } catch (IllegalArgumentException ex) {
            // Token is empty
        }
        return false;
    }
}
