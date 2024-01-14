import { useEffect, useState } from 'react';

export default function Guests(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allGuests, setAllGuests] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userAttending, setUserAttending] = useState(false);

  async function getSingleGuest() {
    const response = await fetch(`${props.baseUrl}/guests/:id`);
    const guest = await response.json();
  }

  async function getAllGuests() {
    setIsLoading(true);
    const response = await fetch(`${props.baseUrl}/guests`);
    const allGuestsArray = await response.json();
    setAllGuests(allGuestsArray);
    setIsLoading(false);
  }

  async function createGuest() {
    const response = await fetch(`${props.baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    getAllGuests();
  }

  async function updateGuest(id) {
    const response = await fetch(`${props.baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !userAttending }),
    });
    const updatedGuest = await response.json();
  }

  async function deleteGuest(id) {
    const response = await fetch(`${props.baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
  }
  async function getUserIdAndRemoveUser(firstName, lastName) {
    if (firstName && lastName) {
      const locatedFirstNameElement = await allGuests.filter(
        (element) => element.firstName === firstName,
      );
      if (locatedFirstNameElement) {
        const locatedUser = locatedFirstNameElement.find(
          (element) => element.lastName === lastName,
        );
        if (locatedUser) {
          await deleteGuest(locatedUser.id);
          getAllGuests();
          alert(`${firstName} ${lastName} was removed.`);
        } else alert('User was not found and could not be removed.');
      } else alert('User was not found and could not be removed.');
    }
  }

  async function getUserIdAndChangeAttendingStatus(firstName, lastName) {
    if (firstName && lastName) {
      const locatedFirstNameElement = await allGuests.filter(
        (element) => element.firstName === firstName,
      );
      if (locatedFirstNameElement) {
        const locatedUser = locatedFirstNameElement.find(
          (element) => element.lastName === lastName,
        );
        if (locatedUser) {
          setUserAttending(!userAttending);
          await updateGuest(locatedUser.id);
          getAllGuests();
        } else
          alert(
            'User was not found, therefore attending status could not be changed.',
          );
      } else
        alert(
          'User was not found, therefore attending status could not be changed.',
        );
    }
  }
  async function adaptAttendingStatus(firstName, lastName) {
    if (firstName && lastName) {
      const locatedFirstNameElement = await allGuests.filter(
        (element) => element.firstName === firstName,
      );
      if (locatedFirstNameElement) {
        const locatedUser = locatedFirstNameElement.find(
          (element) => element.lastName === lastName,
        );
        if (locatedUser) {
          setUserAttending(locatedUser.attending);
          console.log(locatedUser.attending);
          getAllGuests();
        } else {
          setUserAttending(false);
        }
      }
    }
  }
  useEffect(() => {
    if (firstName && lastName) {
      adaptAttendingStatus(firstName, lastName);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    getAllGuests();
  }, []);
  useEffect(() => {
    if (allGuests) {
      console.log(allGuests);
    }
  }, [allGuests]);

  /*   function getGuestAttributes() {
    useEffect(() => {
      if (allGuests) {
        allGuests.map((guest) => {
          console.log(guest.firstName);
          return guest.firstName;
          // <li>{guest.attending}</li>
        });
      }
    }, [allGuests]);
  }
 */
  return (
    <>
      <div data-test-id="guest">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Here ToDo: Create guest, when return button is hit in input field
            // Or maybe in input field
            createGuest();
          }}
        >
          <label htmlFor="first_name">
            First name
            <input
              value={firstName}
              placeholder="First name"
              id="first_name"
              disabled={isLoading}
              onChange={(e) => {
                setFirstName(e.currentTarget.value);
              }}
            ></input>
          </label>
          <label>
            Last name
            <input
              value={lastName}
              placeholder="Last name"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.code == 'Enter') {
                  createGuest();
                  setFirstName('');
                  setLastName('');
                }
              }}
              onChange={(e) => {
                setLastName(e.currentTarget.value);
                //adaptAttendingStatus(firstName, lastName);
              }}
            ></input>
          </label>
          <button
            type="button"
            aria-label={`Remove ${firstName} ${lastName}`}
            disabled={isLoading}
            onClick={() => {
              getUserIdAndRemoveUser(firstName, lastName);
            }}
          >
            Remove
          </button>
          <label htmlFor="attending_checkbox">
            Attending
            <input
              type="checkbox"
              id="attending_checkbox"
              aria-label={`${firstName} ${lastName} attending status`}
              checked={userAttending}
              disabled={isLoading}
              onChange={() => {
                //setUserAttending(!userAttending);
                getUserIdAndChangeAttendingStatus(firstName, lastName);
              }}
            ></input>
          </label>
        </form>
        <div>
          <h1>Guest List</h1>
          {isLoading ? (
            'Loading...'
          ) : allGuests !== undefined ? (
            <div>
              {allGuests.map((guest) => (
                <ul>
                  <li key={guest.id}>{guest.firstName}</li>
                  <li key={guest.id}>{guest.lastName}</li>
                  <li key={guest.id}>
                    {guest.attending === true ? 'yes' : 'no'}
                  </li>
                </ul>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
