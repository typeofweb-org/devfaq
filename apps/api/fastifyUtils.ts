import {
	ContextConfigDefault,
	FastifyBaseLogger,
	FastifySchema,
	FastifyTypeProvider,
	FastifyTypeProviderDefault,
	preValidationAsyncHookHandler,
	preValidationHookHandler,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
	RouteGenericInterface,
} from "fastify";

export function hook<
	RawServer extends RawServerBase = RawServerDefault,
	RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
	RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
	RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
	ContextConfig = ContextConfigDefault,
	SchemaCompiler extends FastifySchema = FastifySchema,
	TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
	Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
	asyncFn: preValidationAsyncHookHandler<
		RawServer,
		RawRequest,
		RawReply,
		RouteGeneric,
		ContextConfig,
		SchemaCompiler,
		TypeProvider,
		Logger
	>,
): preValidationHookHandler<
	RawServer,
	RawRequest,
	RawReply,
	RouteGeneric,
	ContextConfig,
	SchemaCompiler,
	TypeProvider,
	Logger
> {
	return function (request, reply, done) {
		asyncFn.call(this, request, reply).then(
			() => {
				done();
			},
			(err) => {
				done(err);
			},
		);
	};
}
