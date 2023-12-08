const request = require("supertest");
const http = require("http");
const app = require("../server");

describe("POST /patient-data", () => {
  it("should save patient data and mark attendance", async () => {
    const patientData = {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      gender: "Male",
      adhaar_number: "1234567890",
      marital_status: "Single",
      diagnosis: "Flu",
      treatment: "Rest and hydration",
      other_info: "Allergic to penicillin",
    };

    const employeeId = 1; // replace with a valid employee ID
    const deviceLocation = {
      latitude: 40.7128,
      longitude: 74.006,
    };

    try {
      const res = await request(http.createServer(app))
        .post("/patient-data")
        .send({ patientData, employeeId, deviceLocation });

      console.log("Request:", { patientData, employeeId, deviceLocation });
      console.log("Response:", res.body);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Data saved successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
});
