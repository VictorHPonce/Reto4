package vacantes.sgvespringboot.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    public static void main(String[] args) {
        String rawPassword = "miclave123"; // poné tu contraseña
        String encoded = new BCryptPasswordEncoder().encode(rawPassword);
        System.out.println("Hashed password: " + encoded);
    }

}