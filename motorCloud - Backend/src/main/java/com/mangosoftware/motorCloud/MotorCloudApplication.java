package com.mangosoftware.motorCloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MotorCloudApplication {

	public static void main(String[] args) {
		SpringApplication.run(MotorCloudApplication.class, args);
	}

}
