import { Grid, Row, Col, Panel, ProgressBar, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import React, { Component } from 'react';
import classNames from 'classnames';

const SPECIAL_CHARS_REGEX = /[^A-Za-z0-9]/;
const DIGIT_REGEX = /[0-9]/;

class PasswordInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: ''
		};
	}
	static defaultProps = {
		goodPasswordPrinciples: [
			{
				label: '6+ characters',
				predicate: password => password.length >=6
			},
			{
				label: 'with at least one digit',
				predicate: password => password.match(DIGIT_REGEX) !== null
			},
			{
				label: 'with at least one special character',
				predicate: password => password.match(SPECIAL_CHARS_REGEX) !== null
			}
		]
	}
	changePassword = password => {
		this.setState({ password });
	}
	render() {
		const { goodPasswordPrinciples } = this.props;
		const { password } = this.state;
		return (
			<Grid>
				<Row>
					<Col md={8}>
						<PasswordField
							password={password}
							onPasswordChange={this.changePassword}
							principles={goodPasswordPrinciples}
						/>
					</Col>
					<Col md={4}>
						<StrengthMeter
							principles={goodPasswordPrinciples}
							password={password}
						/>
					</Col>
				</Row>
			</Grid>
			)
	}
}

class StrengthMeter extends Component {
	render() {
		const { principles } = this.props;

		return (
			<Panel>
				<PrinciplesProgress {...this.props} />
				<h5>A good password is:</h5>
				<PrincipleList {...this.props}/>
			</Panel>
			);
	}
}

class PrincipleList extends Component {
	principleSatisfied(principle) {
		const { password } = this.props;
		return principle.predicate(password);
	}

	principleClass(principle) {
		const satisfied = this.principleSatisfied(principle);

		return classNames({
			['text-success']: satisfied,
			['text-danger']: !satisfied
		});
	}
	render() {
		const { principles } = this.props;
		return (
			<ul>
				{principles.map((principle, i) =>
					<li key={'principle' + i}
						className={this.principleClass(principle)}
					>
						<small>{principle.label}</small>
					</li>
				)}
			</ul>
			)
	}
}

class PrinciplesProgress extends Component {
	satisfiedPercent() {
		const { principles, password } = this.props;
		const satisfiedCount = principles.map(p => p.predicate(password))
			.reduce((count, satisfied) =>
				count + (satisfied ? 1 : 0), 0);
		const principlesCount = principles.length;
		return (satisfiedCount / principlesCount) * 100.0;
	}

	progressColor() {
		const percentage = this.satisfiedPercent();

		return classNames({
			danger: (percentage < 33.4),
			success: (percentage >= 66.7),
			warning: (percentage >= 33.4 && percentage < 66.7)
		})
	}
	render() {
		return (
			<ProgressBar now={this.satisfiedPercent()}
				bsStyle={this.progressColor()}
			/>
			);
	}
}

class PasswordField extends Component {
	constructor(props) {
		super(props);
	}
	handlePasswordChange = ev => {
		const { onPasswordChange } = this.props;
		onPasswordChange(ev.target.value);
		this.getLabel();
	}
	satisfiedPercent() {
		const { principles, password } = this.props;
		const satisfiedCount = principles.map(p => p.predicate(password))
			.reduce((count, satisfied) =>
				count + (satisfied ? 1 : 0), 0);
		const principlesCount = principles.length;
		return (satisfiedCount / principlesCount) * 100.0;
	}
	getValidationState() {
		const percentage = this.satisfiedPercent();
		return classNames({
			error: (percentage < 33.4),
			success: (percentage >= 66.7),
			warning: (percentage >=33.4 && percentage < 66.7)
		});
	}
	getLabel() {
		const percentage = this.satisfiedPercent();
		if (percentage < 33.4) {
			return 'Bad Password';
		} else if (percentage >= 33.4 && percentage < 66.7) {
			return 'Can-be-better Password';
		} else {
			return 'Great Password';
		}
	}
	render() {
		const { password, label } = this.props;
		return (
			<FormGroup validationState={this.getValidationState()}>
				<ControlLabel>{this.getLabel()}</ControlLabel>
				<FormControl type='password'
					value={password}
					onChange={this.handlePasswordChange}
				/>
				<FormControl.Feedback />
			</FormGroup>
			);
	}
}

export default PasswordInput;
