type Result<Data, Failure = Error> = SuccessRes<Data> | FailureRes<Failure>;

type SuccessRes<Data> = {
  data: Data;
  succeeded: true;
}

type FailureRes<Failure> = {
  error: Failure;
  succeeded: false;
}

function ok<Data>(data: Data) {}
function fail<Failure>(error: Failure) {}