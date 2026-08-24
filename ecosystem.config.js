module.exports = {
  apps: [
    {
      name: "service-student",
      script: "java",
      args: "-jar service-student/target/Student-Service-1.0.0.jar",
      log_file: "./logs/service-student.log",
      instances: 2
    },
    {
      name: "service-program",
      script: "java",
      args: "-jar service-program/target/Program-Service-1.0.0.jar",
      instances: 2
    },
    {
      name: "service-enrollment",
      script: "java",
      args: "-jar service-enrollment/target/Enrollment-Service-1.0.0.jar",
      log_file: "./logs/service-enrollment.log",
      instances: 2
    }
  ]
};