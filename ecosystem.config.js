module.exports = {
  apps: [
    {
      name: "cloud-sql-auth-proxy",
      script: " ./cloud-sql-proxy project-61a10a75-5675-4d5b-a2d:asia-southeast1:mysql-vm project-61a10a75-5675-4d5b-a2d:asia-southeast1:postgres-vm --private-ip",
      log_file: "./logs/cloud-sql-proxy.log"
    },
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