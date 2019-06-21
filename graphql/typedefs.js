
let typeDefs = `
  input ConnectionInput {
    user: String
    password: String
    server: String
    instance: String
    database: String
  }

  input AppointmentInput {
    RecNo: ID
    PatId: ID
    PatName: String
    DctId: ID
    FclId: ID
    Duration: Int
    AppType: String
    AppDateTime: String
    EntryDateTime: String
  }
  
  type DoctorType {
    RecNo: ID
    DctId: ID
    DctName: String
    ShowInPortal: Boolean
  }
  
  type FacilityType {
    RecNo: ID
    FclId: ID
    FclDesc: String
    ShowInPortal: Boolean
  }

  type AppointmentType {
    RecNo: ID
    PatId: ID
    DctId: ID
    FclId: ID
    Duration: Int
    AppType: String
    AppDateTime: String
    EntryDateTime: String
  }

  type Query {
    allDoctors(connection:ConnectionInput) : [DoctorType]
    allFacilities(connection:ConnectionInput) : [FacilityType]
  }
  
  type Mutation {
    createAppointment(connection:ConnectionInput,appointment:AppointmentInput) : AppointmentType
  }
`;

module.exports = typeDefs;