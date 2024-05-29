import { useEffect, useState } from 'react';
import './app.css';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

function FirebaseFirestore() {
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [id, setId] = useState('');
	const [show, setShow] = useState(false);
	const [val, setVal] = useState([]);

	const value = collection(db, 'demo');

	const getData = async () => {
		const dbVal = await getDocs(value);
		setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	};

	useEffect(() => {
		getData();
	}, []);

	const handleCreate = async () => {
		if (!fname || !lname) {
			alert('Both fields are required');
			return;
		}
		await addDoc(value, { name1: fname, name2: lname });
		setFname('');
		setLname('');
		getData(); // Refetch data
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this entry?')) {
			const deleteVal = doc(db, 'demo', id);
			await deleteDoc(deleteVal);
			getData(); // Refetch data
		}
	};

	const handleEdit = (id, name1, name2) => {
		setFname(name1);
		setLname(name2);
		setId(id);
		setShow(true);
	};

	const handleUpdate = async () => {
		if (!fname || !lname) {
			alert('Both fields are required');
			return;
		}
		const updateData = doc(db, 'demo', id);
		await updateDoc(updateData, { name1: fname, name2: lname });
		setShow(false);
		setFname('');
		setLname('');
		getData(); // Refetch data
	};

	return (
		<div className='container'>
			<input
				value={fname}
				onChange={(e) => setFname(e.target.value)}
				placeholder='First Name'
				required
			/>
			<input
				value={lname}
				onChange={(e) => setLname(e.target.value)}
				placeholder='Last Name'
				required
			/>
			{!show ? (
				<button className='submitButton' onClick={handleCreate}>
					Submit
				</button>
			) : (
				<button className='submitButton' onClick={handleUpdate}>
					Update
				</button>
			)}
			<div className='data-list'>
				{val.map((values) => (
					<div key={values.id} className='data-item'>
						<span>{values.name1}</span>
						<span className='pad'>{values.name2}</span>
						<button
							onClick={() => handleEdit(values.id, values.name1, values.name2)}
						>
							Edit
						</button>
						<button className='delete' onClick={() => handleDelete(values.id)}>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default FirebaseFirestore;
