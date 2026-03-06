package com.mangosoftware.motorCloud.Config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig {

        @Autowired
        DataSource dataSource;

        @Bean
        BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();

        }

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf
                                                .ignoringRequestMatchers("/api/**",
                                                                "/login")
                                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                                .cors(cors -> cors
                                                .configurationSource(request -> {
                                                        var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                                                        corsConfiguration.setAllowedOriginPatterns(
                                                                        java.util.List.of("http://localhost:*"));
                                                        corsConfiguration.setAllowedMethods(java.util.List.of("GET",
                                                                        "POST", "PUT", "DELETE", "OPTIONS"));
                                                        corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                                                        corsConfiguration.setAllowCredentials(true);
                                                        return corsConfiguration;
                                                }))
                                .authorizeHttpRequests((requests) -> requests
                                                // Rutas API completamente públicas (sin autenticación)
                                                .requestMatchers("/api/auth/**").permitAll()
                                                // Recursos estáticos
                                                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**",
                                                                "/static/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(exception -> exception
                                                .defaultAuthenticationEntryPointFor(
                                                                (request, response, authException) -> {
                                                                        response.setStatus(401);
                                                                        response.setContentType("application/json");
                                                                        response.getWriter().write(
                                                                                        "{\"error\":\"No autorizado\",\"message\":\"Debe iniciar sesión para acceder a este recurso\"}");
                                                                },
                                                                request -> request.getRequestURI().startsWith("/api"))
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.sendRedirect("/auth/login");
                                                }))
                                .formLogin((form) -> form
                                                .loginPage("/auth/login")
                                                .usernameParameter("username")
                                                .passwordParameter("password")
                                                .permitAll()
                                                .successHandler((request, response, authentication) -> {
                                                        response.sendRedirect("/home?sesionIniciada=INICIADO");
                                                }))
                                .logout((logout) -> logout.permitAll()
                                                .logoutRequestMatcher(
                                                                request -> request.getRequestURI().equals("/logout"))
                                                .logoutSuccessUrl("/home?sesionFinalizada=FINALIZADO")
                                                .permitAll());

                return http.build();
        }

        @Bean
        AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);

                authenticationManagerBuilder
                                .jdbcAuthentication()
                                .dataSource(dataSource)
                                .passwordEncoder(passwordEncoder())
                                // CAST(status AS UNSIGNED) convierte BIT(1) a 0/1 legible como boolean por JDBC
                                .usersByUsernameQuery(
                                                "SELECT username, password, CAST(status AS UNSIGNED) FROM usuarios WHERE username = ?")
                                // La tabla usuarios tiene columna `rol` (enum ADMIN/USER), no hay tabla `roles`
                                // ni columna `id_rol`
                                .authoritiesByUsernameQuery(
                                                "SELECT username, rol FROM usuarios WHERE username = ?");

                return authenticationManagerBuilder.build();
        }
}
