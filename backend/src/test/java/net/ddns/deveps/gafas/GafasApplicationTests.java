package net.ddns.deveps.gafas;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Test de carga del contexto de la aplicación")
class GafasApplicationTests {

    @Test
    @DisplayName("El contexto de Spring debe cargarse correctamente con perfil de test")
    void contextLoads() {
    }
}
